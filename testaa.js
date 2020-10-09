const babel = require('@babel/core');

const generate = require('@babel/generator').default;

console.log(generate({
    type: 'Program',
    body: [{"level":"logicNode","type":"Noop"},{"level":"logicNode","type":"AssignmentExpression","operator":"=","left":{"level":"logicNode","type":"Identifier","name":"data"},"right":{"level":"logicNode","type":"AwaitExpression","callee":null,"queryKey":"getAllEmployees","argument":{"type":"CallExpression","start":0,"end":38,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":38}},"callee":{"type":"MemberExpression","start":0,"end":19,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":19}},"object":{"type":"MemberExpression","start":0,"end":13,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":13}},"object":{"type":"ThisExpression","start":0,"end":4,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":4}}},"property":{"type":"Identifier","start":5,"end":13,"loc":{"start":{"line":1,"column":5},"end":{"line":1,"column":13},"identifierName":"$graphql"},"name":"$graphql"},"computed":false},"property":{"type":"Identifier","start":14,"end":19,"loc":{"start":{"line":1,"column":14},"end":{"line":1,"column":19},"identifierName":"query"},"name":"query"},"computed":false},"arguments":[{"type":"StringLiteral","start":20,"end":37,"loc":{"start":{"line":1,"column":20},"end":{"line":1,"column":37}},"extra":{"rawValue":"getAllEmployees","raw":"'getAllEmployees'"},"value":"getAllEmployees"}]}}},{"level":"logicNode","type":"AssignmentExpression","operator":"=","left":{"level":"logicNode","type":"Identifier","name":"result"},"right":{"level":"logicNode","type":"MemberExpression","object":{"level":"logicNode","type":"MemberExpression","object":{"level":"logicNode","type":"Identifier","name":"data"},"property":{"level":"logicNode","type":"Identifier","name":"Data"}},"property":{"level":"logicNode","type":"Identifier","name":"content"}}}],
}).code);
// const result = babel.parse(`var test = '23'`).program.body[0];

//   console.log(result.declarations[0].init);
//   console.log(forEach.body.body[0].declarations[0].init.property = node.index);
