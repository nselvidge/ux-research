import moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({
  "@root": path.join(__dirname, "../"),
});
