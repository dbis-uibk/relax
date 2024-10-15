export const langPT = {
    'calc.editors.ra.toolbar.left-outer-join': 'left outer join',
    'calc.editors.ra.tab-name': '\u00c1lgebra Relacional',
    'calc.editors.bags.tab-name': '\u00c1lgebra Multiconjunto',
    'db.messages.translate.error-relation-not-found':
      'n\u00e3o foi poss\u00edvel encontrar rela\u00e7\u00e3o "{{name}}"',
    'calc.editors.ra.toolbar.inline-relation-editor-content':
      'criar uma nova rela\u00e7\u00e3o aninhada usando o editor',
    'calc.editors.ra.toolbar.assignment-content':
      '<div><b>X = </b> pi a ( A )\n<br /><b>Y = </b> pi b ( b )\n<br />( X ) <span class="math">&cup;</span> ( Y )<br /></div>',
    'calc.editors.ra.toolbar.greater-or-equals-content': '<div>&sigma',
    'calc.editors.ra.toolbar.duplicate-elimination-content':
      '<b class=\"math\">∂</b> <b>(</b> A <b>)</b>\n<br><b>delta</b> A',
    'calc.editors.ra.toolbar.projection-content':
      '<b class="math">&pi;</b> a, b <b>(</b> A <b>)</b>\n<br><b>pi</b> a, b A',
    'calc.editors.ra.toolbar.inline-relation-content':
      "&sigma; a = 'test' (<b>{<br>a:string, b:number, X.c:date<br>a, 1, 1970-01-01<br>}</b>)",
    'calc.editors.sql.toolbar.group-by-content':
      'SELECT a, COUNT(b) as num <br>FROM A <br>GROUP BY a',
    'calc.editors.ra.toolbar.and-content':
      '<div><span class="math">&sigma;</span> a < b <b class="math">\u2227</b> b <span class="math">\u2260</span> c ( A )</div>',
    'calc.editors.group.sql-import-group-name-placeholder':
      'Nome do grupo (importado de SQL)',
    'db.messages.parser.error-group-non-unique-group-name':
      'nome de grupo duplicado: {{name}}',
    'calc.editors.sql.button-download': 'Download',
    'calc.editors.ra.toolbar.single-line-comment-content':
      '<span class="math">&pi;</span> a, b A <b>-- coment\u00e1rio \u00fatil</b>',
    'calc.editors.group.tab-name': 'Editor de Grupo',
    'calc.editors.ra.toolbar.cross-join-content':
      '<div><b>(</b> A <b>) <b class="math">\u2a2f</b> (</b> B <b>)</b></div>',
    'calc.editors.ra.inline-editor.button-download-csv': 'Download CSV',
    'db.messages.exec.error-column-not-in-both-schemas':
      'coluna "{{column}}" n\u00e3o pode ser encontrada em ambos os esquemas de jun\u00e7\u00e3o',
    'calc.editors.ra.toolbar.intersect': 'intersec\u00e7\u00e3o',
    'db.messages.parser.error-invalid-date-format':
      '"{{str}}" n\u00e3o \u00e9 uma data v\u00e1lida; formato esperado: YYYY-MM-DD',
    'db.messages.exec.error-column-ambiguous':
      'coluna"{{column}}" \u00e9 amb\u00edgua em {{schema}}',
    'calc.editors.ra.inline-editor.row-type': 'Tipo',
    'db.messages.exec.error-condition-must-be-boolean':
      'condi\u00e7\u00e3o deve ser uma express\u00e3o booleana',
    'calc.editors.ra.toolbar.union-content':
      '<div><b>(</b> A <b>) <span class="math">&cup;</span> (</b> B <b>)</b></div>',
    'calc.editors.ra.toolbar.equals': 'igual',
    'calc.editors.ra.toolbar.lesser-or-equals-content': '<div>&sigma',
    'calc.editors.ra.toolbar.right-outer-join-content':
      '<div><b>(</b> A <b class="math">) \u27d6 (</b> B <b>)</b></div>\n<div><b>(</b> A <b class="math">) \u27d6 A.a < B.a (</b> B <b>)</b></div>\n',
    'calc.editors.ra.toolbar.union': 'uni\u00e3o',
    'calc.navigation.help': 'Ajuda',
    'editor.alert-message-headers.warning': 'Perigo',
    'calc.editors.ra.toolbar.single-line-comment': 'coment\u00e1rio em linha',
    'db.messages.parser.error-sqldump-insert-wrong-number-columns':
      'n\u00famero de valores != n\u00famero de colunas',
    'calc.editors.ra.toolbar.left-semi-join-content':
      '<div><b>(</b> A <b class="math">) \u22c9 (</b> B <b>)</b></div>',
    'calc.editors.group.modal-sqldump.button-cancel': 'Cancelar',
    'calc.editors.sql.toolbar.having': 'c\u00e1usula having  clause',
    'db.messages.exec.error-datatype-not-specified-for-col':
      'tipo de dados para a coluna {{index}} ("{{column}}") n\u00e3o foi especificado',
    'calc.editors.sql.toolbar.select': 'cl\u00e1usula select',
    'calc.editors.ra.toolbar.full-outer-join-content':
      '<div><b>(</b> A <b class="math">) \u27d7 (</b> B <b>)</b></div>\n<div><b>(</b> A <b class="math">) \u27d7 A.a != B.a (</b> B <b>)</b></div>',
    'calc.result.modal.title': 'Resultado',
    'calc.editors.ra.button-execute-query': 'Executar consulta',
    'calc.editors.sql.toolbar.order-by-content':
      '<p>SELECT * FROM A ORDER BY a asc, b desc</p><div>SELECT * FROM A ORDER BY 1, 2, 3</div>',
    'calc.editors.ra.toolbar.right-semi-join-content':
      '<div><b>(</b> A <b class="math">) \u22ca (</b> B <b>)</b></div>',
    'calc.editors.ra.toolbar.orderBy': 'ordenar (order by)',
    'calc.editors.ra.toolbar.groupBy': 'agrupar (group by)',
    'db.messages.parser.error-sql-invalid-relation-name':
      '"{{str}}" n\u00e3o pode ser usado como nome de rela\u00e7\u00e3o',
    'calc.editors.ra.inline-editor.input-relation-name':
      'Nome da Rela\u00e7\u00e3o',
    'calc.editors.sql.tab-name-short': 'SQL',
    'db.messages.exec.error-function-expects-type':
      'a fun\u00e7\u00e3o "{{func}}" espera argumentos do tipo "{{expected}}" mas "{{given}}" foi dado',
    'db.messages.parser.error-valueexpr-like-operand-no-string':
      'operando direito de LIKE deve ser uma string literal',
    'calc.editors.ra.toolbar.anti-join': 'anti join',
    'calc.editors.group.modal-sqldump.button-import-sql': 'Importar SQL',
    'calc.editors.ra.toolbar.insert-date-content':
      "<span class=\"math\">&sigma;</span> a &lt; <b>date('1970-01-01')</b> ( A )",
    'editor.inline-relation-editor.error-wrong-quoted-string':
      'string n\u00e3o deve conter aspas simples e duplas',
    'calc.editors.ra.toolbar.greater-or-equals': 'maior ou igual',
    'db.messages.parser.error-group-header-name-empty':
      'o nome do grupo n\u00e3o pode ser vazio',
    'calc.editors.ra.toolbar.orderBy-content':
      '<div><b class="math">&tau;</b> a asc, [2] desc <b> (</b> A <b>)</b><div><div><b class="math">tau</b> a asc, [2] desc <b> (</b> A <b>)</b></div>',
    'db.messages.parser.error-duplicate-variable':
      'nome de vari\u00e1vel duplicado: {{name}}',
    'db.messages.exec.error-invalid-projection-error':
      'proje\u00e7\u00e3o inv\u00e1lida "{{argument}}": {{erro}}',
    'calc.editors.sql.toolbar.where': 'cl\u00e1usula where',
    'calc.editors.ra.toolbar.selection-content':
      '<b class="math">&sigma;</b> a < b \u2227 b <span class="math">\u2260<span> c <b>(</b> A <b>)</b>\n<br><b>sigma</b> a < b and b != c A',
    'calc.editors.ra.toolbar.not': 'n\u00e3o',
    'calc.menu.headline': 'Carregue um Dataset',
    'calc.editors.ra.toolbar.intersect-content':
      '<div><b>(</b> A <b>) <span class="math">&cap;</span> (</b> B <b>)</b></div>',
    'calc.editors.ra.button-download': 'Download',
    'calc.editors.ra.button-download-csv': 'Resultado',
    'calc.editors.ra.button-download-query': 'Query',
    'calc.editors.ra.button-zoom-in': 'Aumentar zoom',
    'calc.editors.ra.button-zoom-out': 'Diminuir zoom',
    'calc.editors.ra.button-zoom-reset': 'Redefinir zoom',
    'calc.editors.ra.button-zoom-center': 'Alinhar à visualização',
    'db.messages.parser.error-sql-group-by-missing':
      'group by est\u00e1 faltando',
    'db.messages.exec.error-could-not-compare-different-types':
      'n\u00e3o foi poss\u00edvel comparar o valor se os tipos forem diferentes: {{typeA}}! = {{typeB}}',
    'calc.editors.ra.toolbar.autoreplace-operators.none':
      'sem substitui\u00e7\u00e3o',
    'calc.editors.ra.toolbar.selection': 'Sele\u00e7\u00e3o',
    'calc.editors.group.modal-sqldump.description':
      'Coloque seu SQL-Dump aqui para criar um grupo.',
    'calc.editors.ra.toolbar.subtraction-content':
      '<div><b>(</b> A <b>) - (</b> B <b>)</b></div>\n<div><b>(</b> A <b>) \n (</b> B <b>)</b></div>',
    'calc.editors.sql.toolbar.having-content':
      'SELECT a, SUM(b) as sum <br>FROM A <br>GROUP BY a<br>having sum > 10',
    'calc.editors.sql.toolbar.from': 'cl\u00e1usula from',
    'calc.editors.sql.toolbar.order-by': 'cl\u00e1usula order by',
    'calc.editors.ra.toolbar.cross-join': 'jun\u00e7\u00e3o cruzada (cross join)',
    'calc.menu.create-own-dataset-text':
      'Voc\u00ea pode criar seu pr\u00f3prio conjunto de dados e compartilh\u00e1-lo com outras pessoas. Saiba mais sobre isso no ',
    'db.messages.parser.error-sql-string-use-single-quotes':
      'use aspas simples para strings (caracteres/texto)',
    'editor.inline-relation-editor.button-ok': 'Ok',
    'calc.editors.group.toolbar.import-sql-content': 'Importar SQL-dump',
    'calc.editors.ra.inline-editor.button-ok': 'Ok',
    'calc.menu.load-gist-button': 'Carregar',
    'db.messages.exec.error-join-would-produce-non-unique-columns':
      'a jun\u00e7\u00e3o resultaria em nomes de coluna n\u00e3o \u00fanicos',
    'db.messages.exec.error-case-when-expects-results-of-same-type':
      '<i> CASE WHEN condi\u00e7\u00e3o THEN resultado END </i> espera que todos os <i> resultados <i /> sejam do mesmo tipo',
    'calc.editors.ra.toolbar.rename':
      'renomear rela\u00e7\u00e3o / renomear colunas',
    'calc.menu.datasets': 'Datasets',
    'calc.maintainer-groups.uibk': 'University of Innsbruck',
    'calc.editors.ra.toolbar.natural-join': 'natural join / \u03b8-join',
    'db.messages.translate.warning-distinct-missing':
      'DISTINCT est\u00e1 faltando',
    'calc.editors.ra.toolbar.multi-line-comment': 'coment\u00e1rio multilinha',
    'calc.editors.group.button-use_plural': 'Use o primeiro Grupo no Editor',
    'calc.messages.gist-load-success': 'gist carregado com sucesso',
    'editor.pegjs-error.expected-found':
      'esperado {{expected}}, mas {{found}} encontrado.',
    'editor.inline-relation-editor.enter-your-data':
      'por favor, insira seus dados',
    'calc.editors.sql.toolbar.from-content':
      '<div>SELECT * <br>FROM A, B as b<br>INNER JOIN C NATURAL</div>',
    'calc.editors.ra.toolbar.rename-columns-operator':
      'operador renomear colunas',
    'db.messages.exec.error-function-expects-arguments-of-same-type':
      '{{func}} espera que todos os argumentos sejam do mesmo tipo',
    'calc.editors.ra.toolbar.right-outer-join': 'right outer join',
    'editor.alert-message-headers.error': 'Erro',
    'calc.editors.insert-relation-tooltip':
      'Inserir rela\u00e7\u00e3o ou nomes de coluna',
    'editor.error-no-query-found': 'nenhuma consulta encontrada',
    'calc.editors.ra.toolbar.division': 'divis\u00e3o',
    'editor.pegjs-error.or': 'ou',
    'calc.editors.ra.toolbar.groupBy-content':
      '<div><b class="math">&gamma;</b> a, b<b>;</b> count(c)\u2192c ( A )</div>\n<div><b class="math">gamma</b> count(a)->x, sum(b)->y ( A )</div>',
    'db.messages.exec.error-column-not-found-index':
      '\u00edndice da coluna "{{column}}" est\u00e1 fora do intervalo no esquema {{schema}}; \u00edndice come\u00e7a em 1',
    'calc.editors.ra.toolbar.rename-content':
      '<div><span class="math">&sigma;</span> x.a > 1 ( <b class="math">&rho;</b> x <b>(</b> A <b>)</b> )</div>\n<div class="math">&sigma; A.y > 2 ( <b class="math">rho</b> y<b class="math">\u2190</b>a <b>(</b> A <b>)</b> )</div>',
    'calc.editors.ra.toolbar.anti-join-content':
      '<div><b>(</b> A <b class="math">) \u25b7 (</b> B <b>)</b></div>',
    'db.messages.exec.error-invalid-date-format':
      '"{{str}}" n\u00e3o \u00e9 uma data v\u00e1lida; formato esperado: YYYY-MM-DD',
    'calc.editors.ra.toolbar.multi-line-comment-content':
      '<b>/* este \u00e9 um coment\u00e1rio longo,<br>muito longo*/</b><br><span class="math">&pi;</span> a, b A',
    'db.messages.parser.error-sql-negative-limit':
      'o limite dado precisa ser >= 0',
    'calc.editors.ra.toolbar.rename-columns-operator-content':
      '<div class="math">&sigma; A.y > 2 ( <b>&rho;</b> y<b class="math">\u2190</b>a <b>(</b> A <b>)</b> )</div>',
    'db.messages.translate.error-variable-name-conflict':
      'conflito de nomes: o nome da rela\u00e7\u00e3o "{{name}}" j\u00e1 existe',
    'calc.editors.ra.toolbar.duplicate-elimination': 'Elimina\u00e7\u00e3o de duplicatas',
    'calc.editors.ra.toolbar.projection': 'Proje\u00e7\u00e3o',
    'calc.editors.ra.toolbar.or': 'ou',
    'db.messages.exec.error-no-columns-match-alias-star':
      'nenhuma coluna corresponde a "{{alias}}.*"',
    'calc.navigation.calc': 'Calcular',
    'calc.editors.ra.toolbar.autoreplace-operators.plain2math': 'pi => \u03c0',
    'db.messages.translate.warning-ignored-all-on-set-operators':
      'ignorou ALL na opera\u00e7\u00e3o definida',
    'db.messages.exec.error-func-not-defined-for-column-type':
      '{{func}} n\u00e3o definida para o tipo {{colType}}',
    'db.messages.parser.error-sqldump-invalid-column-number':
      'n\u00famero inv\u00e1lido de colunas na linha {{line}}',
    'calc.editors.group.button-exec': 'Visualizar',
    'db.messages.exec.error-could-not-change-rel-alias-ambiguity':
      'n\u00e3o foi poss\u00edvel definir o \u201dalias\u201d da rela\u00e7\u00e3o \u201c{{alias}}\u201d por causa da ambiguidade',
    'editor.pegjs-error.no-input-found': 'nenhuma entrada encontrada',
    'db.messages.parser.error-group-header-name-missing':
      'o nome do grupo est\u00e1 faltando (group: ....)',
    'calc.editors.ra.toolbar.assignment': 'atribui\u00e7\u00e3o',
    'calc.editors.ra.toolbar.or-content':
      '<div><span class="math">&sigma;</span> a < b <b class="math">\u2228</b> b <span class="math">\u2260</span> c ( A )</div>',
    'calc.editors.ra.toolbar.right-semi-join': 'right semi join',
    'calc.editors.sql.toolbar.insert-date': 'inserir data',
    'calc.editors.ra.toolbar.left-semi-join': 'left semi join',
    'calc.maintainer-groups.misc': 'Diversos',
    'calc.editors.ra.toolbar.not-equals-content': '<div>&sigma',
    'calc.editors.ra.toolbar.xor': 'ou exclusivo (xor)',
    'calc.editors.ra.inline-editor.row-name': 'Nome',
    'editor.inline-relation-editor.button-cancel': 'Cancelar',
    'calc.editors.group.modal-sqldump.button-close': 'Fechar',
    'calc.editors.button-history': 'Hist\u00f3rico',
    'calc.editors.ra.inline-editor.button-upload-csv': 'Upload CSV',
    'calc.navigation.language': 'Linguagem',
    'calc.menu.create-own-dataset-headline': 'Crie seu pr\u00f3prio Dataset',
    'calc.editors.group.toolbar.import-sql': 'Importar SQL-dump',
    'calc.editors.ra.toolbar.autoreplace-operators.math2plain': '\u03c0 => pi',
    'db.messages.parser.error-sql-invalid-column-name':
      '"{{str}}" n\u00e3o pode ser usado como nome de coluna',
    'calc.editors.ra.toolbar.xor-content':
      '<div><span class="math">&sigma;</span> a < b <b class="math">\u2295</b> b <span class="math">\u2260</span> c ( A )</div>',
    'calc.editors.sql.button-execute-selection': 'Executar sele\u00e7\u00e3o',
    'editor.inline-relation-editor.error-column-name-missing':
      'nome da coluna ausente na coluna {{index}}',
    'db.messages.exec.error-could-not-rename-ambiguity':
      'n\u00e3o foi poss\u00edvel definir o novo nome "{{newName}}" para "{{oldName}}" devido a ambiguidade em {{schema}}',
    'calc.navigation.take-a-tour': 'Fa\u00e7a um Tour',
    'calc.editors.ra.toolbar.natural-join-content':
      '<div><b>(</b> A <b>) <b class="math">\u22c8</b> (</b> B <b>)</b></div>\n<div><b>(</b> A <b class="math">) \u22c8 A.a \u2265 B.a (</b> B <b>)</b></div>',
    'db.messages.parser.error-group-non-unique-attribute':
      'atributo n\u00e3o \u00fanico {{name}} na coluna {{index}}',
    'calc.menu.create-own-dataset-button-modify': 'Modificar Dataset',
    'calc.editors.sql.toolbar.insert-date-content':
      'select * from A\nwhere a &lt; <b>date("1970-01-01")</b>',
    'calc.editors.ra.toolbar.division-content':
      '<div><b>(</b> A <b>) \u00f7 (</b> B <b>)</b></div>',
    'calc.editors.sql.button-execute-query': 'Executar consulta',
    'calc.editors.group.tab-name-short': 'EG',
    'calc.editors.sql.toolbar.limit': 'cl\u00e1usula limit',
    'db.messages.exec.error-column-index-out-of-range':
      '\u00edndice da coluna "{{column}}" est\u00e1 fora do intervalo no esquema {{schema}}; \u00edndice come\u00e7a em 1',
    'calc.messages.error-query-missing': 'nenhuma consulta encontrada',
    'calc.editors.group.button-download': 'Download',
    'calc.messages.error-query-missing-assignments-found':
      'apenas atribui\u00e7\u00f5es encontradas; falta a consulta <a href="help.htm#relalg-assignment" target="_blank"> Ajuda - Tarefas </a>',
    'db.messages.parser.error-group-unknown-header':
      'cabe\u00e7alho desconhecido {{name}}',
    'calc.editors.group.modal-sqldump.modal-title': 'Importar SQL-dump',
    'calc.maintainer-groups.saarland': 'University of Saarland',
    'calc.editors.ra.toolbar.and': 'e',
    'calc.editors.group.button-use': 'Use Grupo no Editor',
    'editor.alert-message-headers.success': 'Sucesso',
    'editor.codemirror-placeholder':
      'Digite sua consulta aqui\n\nAtalhos do teclado:\n\texecutar declara\u00e7\u00e3ot:    [CTRL]+[RETURN]\n\texecutar sele\u00e7\u00e3o:    [CTRL]+[SHIFT]+[RETURN]\n\tautocompletar:         [CTRL]+[SPACE]\n',
    'calc.editors.ra.toolbar.lesser-or-equals': 'menor ou igual',
    'calc.navigation.feedback': 'Feedback',
    'calc.editors.ra.button-execute-selection': 'Executar sele\u00e7\u00e3o',
    'calc.editors.ra.toolbar.equals-content': '<div>&sigma',
    'calc.editors.sql.toolbar.select-content':
      '<p>SELECT * FROM A</p><div>SELECT a, A.b, A.c FROM A</div>',
    'calc.editors.ra.toolbar.insert-date': 'inserir data',
    'calc.editors.sql.tab-name': 'SQL',
    'calc.editors.ra.toolbar.autoreplace-operators.header':
      'substituir operadores automaticamente',
    'calc.editors.ra.toolbar.full-outer-join': 'full outer join',
    'db.messages.exec.error-column-not-found-name':
      'n\u00e3o foi poss\u00edvel encontrar a coluna "{{column}}" no esquema {{schema}}',
    'db.messages.exec.error-schema-a-not-part-of-schema-b':
      'esquema {{schemaA}} n\u00e3o \u00e9 parte de {{schemaB}}',
    'calc.editors.ra.toolbar.inline-relation-editor':
      'rela\u00e7\u00e3o aninhada (editor)',
    'calc.result.modal.close': 'Fechar',
    'calc.editors.group.toolbar.add-new-relation': '+ nova rela\u00e7\u00e3o',
    'calc.editors.ra.toolbar.not-equals': 'n\u00e3o igual',
    'calc.editors.ra.toolbar.left-outer-join-content':
      '<div><b>(</b> A <b class="math">) \u27d5 (</b> B <b>)</b></div>\n<div><b>(</b> A <b class="math">) \u27d5 A.a < B.a (</b> B <b>)</b></div>\n',
    'calc.editors.group.toolbar.add-new-relation-content':
      'Abrir editor de rela\u00e7\u00f5es',
    'db.messages.exec.error-case-when-condition-must-be-boolean':
      'a condi\u00e7\u00e3o de um CASE WHEN deve ser do tipo booleano',
    'calc.maintainer-groups.temp': 'Tempor\u00e1rio',
    'editor.pegjs-error.end-of-input': 'fim da entrada',
    'calc.editors.sql.toolbar.where-content':
      'SELECT * FROM A, B <br>where A.a = B.a or false',
    'db.messages.parser.error-sqldump-invalid-type':
      'tipo inv\u00e1lido na linha  {{line}}',
    'calc.editors.ra.inline-editor.title': 'Editor de Rela\u00e7\u00e3o',
    'calc.editors.sql.toolbar.group-by': 'cl\u00e1usula group by',
    'db.messages.parser.error-group-duplicate-header':
      'cabe\u00e7alho duplicado {{name}}',
    'calc.menu.create-own-dataset-button-new': 'Criar novo Dataset',
    'calc.menu.create-own-dataset-text-link': 'Tutorial de manuten\u00e7\u00e3o',
    'editor.inline-relation-editor.placeholder-column-name-and-types':
      'columnName:type',
    'calc.editors.ra.inline-editor.button-cancel': 'Cancelar',
    'editor.error-at-line-x': 'na linha {{line}}',
    'db.messages.exec.error-schemas-not-unifiable':
      'os esquemas n\u00e3o s\u00e3o unific\u00e1veis: os tipos ou o tamanho diferem: {{schemaA}} e {{schemaB}}',
    'calc.editors.ra.toolbar.autoreplace-operators.title':
      'substitui\u00e7\u00e3o de operador',
    'calc.menu.load-gist-insert-placeholder': 'gist ID',
    'calc.editors.ra.tab-name-short': 'AlgRel',
    'calc.editors.bags.tab-name-short': 'AlgBag',
    'calc.menu.load-gist-headline': 'Carregar Dataset armazenado em um gist',
    'calc.editors.sql.toolbar.limit-content':
      'SELECT * FROM A <br>LIMIT 10 OFFSET 0',
    'db.messages.exec.error-column-not-unique':
      'n\u00e3o foi poss\u00edvel adicionar a coluna "{{column}}" devido a ambiguidade',
    'editor.alert-message-headers.info': 'Info',
    'calc.editors.ra.toolbar.subtraction': 'subtra\u00e7\u00e3o',
    'calc.editors.insert-relation-title': 'Inserir',
    'db.messages.parser.error-sql-having-without-group-by':
      '\u201chaving\u201d encontrado, mas sem "group by" ou agrega\u00e7\u00e3o',
    'db.messages.translate.error-variable-cyclic-usage':
      'uso c\u00edclico da vari\u00e1vel "{{name}}" detectado',
    'calc.editors.ra.toolbar.not-content': '<div>&sigma',
    'calc.editors.ra.toolbar.inline-relation': 'rela\u00e7\u00e3o aninhada',
    'calc.editors.group.new-group-example-group':
      '\u2013 este \u00e9 um exemplo\n\ngroup: nomeDoNovoGrupo \n\n\nA = {\n\ta:string, b:number\n\texemplo,  42\n}',
	'local.change': 'Recarregar página para alterar o idioma?'
  };
  
