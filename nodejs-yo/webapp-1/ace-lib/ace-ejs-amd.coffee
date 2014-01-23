fs = require 'fs'
path = require 'path'

_buildAmdMod = (path) ->
	content = fs.readFileSync path, encoding:'utf-8'

	content = _wrapAmd 'path': path, 'content': content.replace(/(\'|\")/g , '\\\'')
	fs.writeFileSync path + '.js', content, encoding:'utf-8'

_wrapAmd = (tpl) ->
	"define ([\'#{tpl.path}\'] , function(require) {\n var EJS = require('ace-ejs');\n return {\n tpl : new EJS({'text': \'#{tpl.content}\'})};\n});"

#test
_buildAmdMod('./test/ejs/test.ejs');
