const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-1' });

const isLocal = process.env['TODOMANAGERLOCAL']
if (!isLocal) {
AWS.config.update({
credentials: {
accessKeyId: 'AKIATLL5ELE6TW7DR3NV',
secretAccessKey: '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'
}
});
} else {
AWS.config.update({
endpoint: 'http://localhost:8000'
});
}
module.exports = AWS;

AWS.config.update({
endpoint: 'http://localhost:8000'
});
module.exports = AWS;
• Crie o arquivo taskDAO.js
const AWS = require('./AWSProvider');
const uuid = require('uuid');
const dynamoDB = new AWS.DynamoDB();
const init = (callback) => {
dynamoDB.listTables({}, (err, data) => {
if (err) {
callback(err, null);
} else {
if (data.TableNames.indexOf('Tasks') == -1) {
dynamoDB.createTable({
TableName: 'Tasks',
AttributeDefinitions: [
{ AttributeName: 'id', AttributeType: 'S' },
],
KeySchema: [
{ AttributeName: 'id', KeyType: 'HASH' },
],
ProvisionedThroughput: {
ReadCapacityUnits: 1,
WriteCapacityUnits: 1
},
}, (err, data) => {
callback(err, data);
})
} else {
callback(err, { message: 'ok' });
}
}
});
	}
const insert = (task, callback) => {
const id = task.id || uuid();
dynamoDB.putItem({
TableName: 'Tasks',
Item: {
"id": { S: id },
"title": { S: task.title },
"description": { S: task.description },
"isPriority": { BOOL: task.isPriority },
"isDone": { BOOL: task.isDone }
}
}, (err, data) => {
if (err) {
callback(err, null)
} else {
callback(null, {
id,
title: task.title,
description: task.description,
isPriority: task.isPriority,
isDone: task.isDone
})
}
});
}
const listAll = (callback) => {
dynamoDB.scan({ TableName: 'Tasks' }, (err, data) => {
if (err) {
callback(err, null);
} else {
const list = [];
data.Items.forEach(item => {
const task = {
id: item.id.S,
title: item.title.S,
description: item.description.S,
isPriority: item.isPriority.BOOL,
isDone: item.isDone.BOOL,
}
list.push(task);
});
callback(null, list);
}
});
}
const findTaskById = (id, callback) => {
dynamoDB.getItem({
TableName: 'Tasks',
Key: {
	"id": { S: id }
}
}, (err, data) => {
if (err) {
callback(err, null);
} else {
const item = data.Item;
var task = null;
if (item) {
task = {
id: item.id.S,
title: item.title.S,
description: item.description.S,
isPriority: item.isPriority.BOOL,
isDone: item.isDone.BOOL,
}
}
callback(null, task)
}
});
}
const remove = (id, callback) => {
dynamoDB.deleteItem({
TableName: 'Tasks',
Key: {
"id": { S: id }
}
}, (err, data) => {
if (err) {
callback(err, null);
} else {
callback(null, {
message: 'deleted'
});
}
})
}

module.exports = { insert, listAll, findTaskById, remove, init }
