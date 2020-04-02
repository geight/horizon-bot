module.exports = {
    name: 'horizon',
	description: 'Set the daily hot item or turnip value for a user\'s island or list values.',
	args: true,
    execute(Discord,Enmap,client,message,args) {
        const key = `${message.guild.id}-${message.author.id}`;
        const d = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
        const cst_d = new Date(d);
        const date = cst_d.getDate();
        const month = cst_d.getMonth()+1;
        const year = cst_d.getFullYear();
        
        let action = args[0];
        let value = args[1];
        
        switch(action) {
            case "--item":
                
                client.horizon.ensure(key, {
                    user: message.author.id,
                    name: message.author.username,
                    guild: message.guild.id,
                    turnipValue: 0,
                    item: null
                });
                
                client.horizon.set(key, value, "item");
                                    
                var output = "";
                output += ("```");
                output += (`User: ${message.author.username}\nItem: ` + value + `\n` + `Date: ` + month + `-` + date + `-` + year + `\n`);
                output += ("```");
                message.channel.send(output);
        
                break;
            case "--turnip":

                client.horizon.ensure(key, {
                    user: message.author.id,
                    name: message.author.username,
                    guild: message.guild.id,
                    turnipValue: 0,
                    item: null,
                });
                
                client.horizon.set(key, value, "turnipValue");
                    
                var output = "";
                output += ("```");
                output += (`User: ${message.author.username}\nTurnip Value: ` + value + `\n` + `Date: ` + month + `-` + date + `-` + year + `\n`);
                output += ("```");
                message.channel.send(output);
        
                break;
            case "--list":
                const list = client.horizon.array().filter( p => p.guild === message.guild.id );
                
                var filtered = list.filter(function(x) {
                    return x !== undefined;
                });

                console.log(filtered);

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Item and value list for ` + month + `-` + date + `-` + year)
                    .setAuthor(client.user.username, client.user.avatarURL)
                    .setDescription("List of daily hot items and turnip values for user islands.")
                    .setColor(0x00AE86);
                
                filtered.forEach(data => {
                    embed.addField(`Hot Items`, `${data.name}:\t ${data.item}`, inline=true);
                    embed.addField(`Turnip Values`, `${data.name}:\t ${data.turnipValue}`, inline=true);
                });

                message.channel.send({embed});
                break;
                
            case "--help":
                var output = "";
                output += ("```");
                output += (`Supported commands:\n--item <itemName|item_name>\n--turnip <value>\n--list\n`)
                output += ("```");
                message.channel.send(output);
                break;
            }
    },
};