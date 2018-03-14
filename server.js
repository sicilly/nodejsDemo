//建立一个Socket服务端
const net = require('net');
//用户存储所有的连接
var clients = [];
//创建一个Socket服务器
var server = net.createServer((socket)=> {
    //哪个客户端与我连接 socket就是谁
        clients.push(socket);
        console.log(`welcome ${socket.remoteAddress} to 2080 chatroom,当前在线 ${clients.length}`);

        //有任何客户端发消息都会触发
        socket.on('data',clientData).on('error',(err)=>{
            clients = cilents.splice(clients.indexOf(socket),1);
            console.log(`${socket.remoteAddress}下线了，当前在线${clients.length}`);
        });

        //广播消息
        function boardcast(signal) {
            //console.log(signal);
            //用户名和消息
            var username = signal.from;
            var message = signal.message;
            //我们要发给客户端的东西
            var send = {
                procotol:signal.procotol,
                from:username,
                message:message
            };
            //广播消息
            clients.forEach(client=>{
                client.write(JSON.stringify(send));
            });
        }


        //点对点
        function p2p(signal) {
            //console.log(signal);
            //用户名和消息
            var username = signal.from;
            var target = signal.to;
            var message = signal.message;
            //我们要发给客户端的东西
            var send = {
                procotol:signal.procotol,
                from:username,
                message:message
            };
            //发送消息
            clients[target].write(JSON.stringify(send));
        }
            function clientData(chunk) {
               try {
                var signal = JSON.parse(chunk.toString().trim());
                var procotol = signal.procotol;
                switch (procotol) {
                    case 'boardcast':
                        boardcast(signal);
                        break;
                    case 'p2p':
                        p2p(signal);
                        break;
                    // case 'shake':
                    //     boardcast(signal);
                    //     break;                                    
                    default:
                        socket.write('有错误');
                        break;
                }

            } catch (error) {
                socket.write('有错误');
            }             
            }
});

var port = 2080;
//监听特定的端口
server.listen(port,(err)=>{
    //成功监听2080端口后执行 如果监听失败（端口被别人用了）会有error
    if(err){
        console.log('端口被占用');
        return false;
    }
    console.log(`服务端正常启动监听【${port}】端口`);
});
