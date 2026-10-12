"""Validate first-region artwork without modifying images; Python standard library only."""
import hashlib, json, pathlib, struct, zlib

ROOT = pathlib.Path(__file__).resolve().parent

def inspect_png(data):
    assert data[:8] == b'\x89PNG\r\n\x1a\n', "Invalid PNG signature"
    width, height = struct.unpack(">II", data[16:24])
    depth, color = data[24:26]
    offset, chunks = 8, []
    while offset < len(data):
        size = struct.unpack(">I", data[offset:offset + 4])[0]
        kind = data[offset + 4:offset + 8]
        payload = data[offset + 8:offset + 8 + size]
        crc = struct.unpack(">I", data[offset + 8 + size:offset + 12 + size])[0]
        assert zlib.crc32(kind + payload) & 0xffffffff == crc, "PNG chunk CRC mismatch"
        if kind == b"IDAT":
            chunks.append(payload)
        offset += size + 12
    decoded = zlib.decompress(b"".join(chunks))
    alpha = 0
    if depth == 8 and color == 6 and data[28] == 0:
        row, filt = bytearray(decoded[1:1 + width * 4]), decoded[0]
        assert filt in range(5), "Unsupported PNG filter"
        for x in range(len(row)):
            left = row[x - 4] if x >= 4 else 0
            prediction = left if filt in (1, 4) else left // 2 if filt == 3 else 0
            row[x] = (row[x] + prediction) & 255
        alpha = sum(value < 255 for value in row[3::4])
    return width, height, depth, color, alpha

def main():
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    source = json.loads((ROOT.parent.parent / "manifest.json").read_text(encoding="utf-8"))
    assets = manifest["assets"]
    ids = {asset["id"] for asset in assets}
    expected = {a["id"] for a in source["assets"] if a["phase"] in
                ("Reference first", "First region", "First region supporting panel")}
    assert len(ids) == len(assets) == manifest["imageCount"]
    assert expected == {a["requestId"] for a in assets}
    assert len(expected) == manifest["requestCount"]
    for asset in assets:
        target = (ROOT / asset["path"]).resolve()
        assert target.is_relative_to(ROOT), "Image path leaves artwork folder"
        data = target.read_bytes()
        dimensions = inspect_png(data)
        assert dimensions[:4] == (asset["width"], asset["height"], asset["bitDepth"], asset["colorType"]), asset["id"]
        assert dimensions[4] == asset["firstRowTransparentPixels"], asset["id"]
        assert not asset["transparentRequested"] or dimensions[4] > 0, asset["id"]
        assert len(data) == asset["bytes"], asset["id"]
        assert hashlib.sha256(data).hexdigest() == asset["sha256"], asset["id"]
        assert hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest() == asset["gitBlobSha"], asset["id"]
        assert set(asset["refs"]) <= ids, asset["id"]
        sidecar = json.loads((ROOT / asset["promptPath"]).read_text(encoding="utf-8"))
        assert sidecar == asset, asset["id"]
    assert sum(a["bytes"] for a in assets) == manifest["totalBytes"]
    print(f"PASS: {len(assets)} PNGs, {len(expected)} requests, hashes, transparency samples, references and sidecars.")

if __name__ == "__main__":
    main()
