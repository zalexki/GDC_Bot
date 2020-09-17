const { compareSync } = require("dir-compare");

exports.compareFolders = async (path1, path2) => {
  const result = compareSync(path1, path2, {
    compareContent: true,
    skipSubdirs: true,
  });

  return result.same;
};
