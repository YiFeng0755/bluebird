/*** Generated by streamline 0.10.15 (fibers-fast) - DO NOT EDIT ***/var fstreamline__ = require("streamline/lib/fibers-fast/runtime");(function(){})(); fstreamline__.create((function(_) { require('../lib/fakes');

function upload(stream, idOrPath, tag, _) {
    try {
        var blob = blobManager.create(account);
        var tx = db.begin();
        var blobId = fstreamline__.invoke(blob, "put", [stream, _], 1);
        var file = fstreamline__.invoke(self.byUuidOrPath(idOrPath), "get", [_], 0);

        var previousId = file ? file.version : null;
        version = {
            userAccountId: userAccount.id,
            date: new Date(),
            blobId: blobId,
            creatorId: userAccount.id,
            previousId: previousId,
        };
        version.id = Version.createHash(version);
        fstreamline__.invoke(Version.insert(version), "execWithin", [tx, _], 1);
        if (!file) {
            var splitPath = idOrPath.split('/');
            var fileName = splitPath[splitPath.length - 1];
            file = {
                id: uuid.v1(),
                userAccountId: userAccount.id,
                name: fileName,
                version: version.id
            }
            var query = fstreamline__.invoke(self, "createQuery", [idOrPath, file, _], 2);
            fstreamline__.invoke(query, "execWithin", [tx, _], 1);
        }
        fstreamline__.invoke(FileVersion.insert({fileId: file.id, versionId: version.id}), "execWithin", [
            tx, _], 1);
        fstreamline__.invoke(File.whereUpdate({id: file.id}, {version: version.id}), "execWithin", [
            tx, _], 1);
        tx.commit();
    } catch (err) {
        tx.rollback();
        throw err;
    }
}

module.exports = function(stream, idOrPath, tag, cb) {
    fstreamline__.create(upload,3)(stream, idOrPath, tag,   cb);
}

}),0)(  function(err) {
  if (err) throw err;
});
