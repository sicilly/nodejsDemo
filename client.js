//客户端
const net = require('net');
const readline = require('readline');
const rl = readline.createInterface(process.stdin,process.stdout);

rl.question('What is your name?',(name)=>{
    name = name.trim();
    if(!name){
        throw new Error('没名字还出来混');
    }
    //创建与服务端的连接
    var server = net.connect({port:2080},()=>{
        console.log(`Welcome ${name} to 2080 chatroom`);
        //监听服务端发过来的数据
        server.on('data',(chunk)=>{
            try {
                var signal = JSON.parse(chunk.toString().trim());
                var procotol = signal.procotol;
                switch (procotol) {
                    case 'boardcast':
                        console.log('\nboardcast['+signal.from + ']>'+signal.message +'\n');
                        rl.prompt();
                        break;
                    case 'p2p':
                        console.log('\np2p['+signal.from + ']>'+signal.message +'\n');
                        rl.prompt();
                        break;                                 
                    default:
                        server.write('有错误');
                        break;
                }

            } catch (error) {
                server.write('有错误');
            }
        });

});

        rl.setPrompt(name+">");  //此时没有写到控制台
        rl.prompt();            //写入控制台
        rl.on('line',(line)=>{  //当用户在控制台敲回车 输入的内容通过line拿到
            line = line.toString().trim();
            var temp = line.split(':');
            var send;
            if(temp.length === 2){
                //点对点
                send = {
                    procotol:'p2p',
                    from:name,     //用户输入的名字
                    to:temp[0],
                    message:temp[1] //用户输入的内容
                };            
    
            }else{
                //广播
                send = {
                    procotol:'boardcast',
                    from:name,                      //用户输入的名字
                    message:line  //用户输入的内容
                };
                //console.log(JSON.stringify(send));
                //序列化为json字符串，写到socket当中，发送给服务端
             }   

                server.write(JSON.stringify(send));  
                //输出用户名 等待用户下一次输入
                rl.prompt();                
            
        

        }).on('close',()=>{

        });        
    });


