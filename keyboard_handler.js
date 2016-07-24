//COntains javscript Keyboard handler for handling key inputs in terminal

var command = "";
var numbers = ['0','1','2','3','4','5','6','7','8','9'];
var alphabet = [ 'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var user = "ruthra";
var system = "BackBox-4.4";
var cursor = 0;
var cmd_hist = [];
var history_index = 0;
var tmp_cmd = "";
var tmp_cursor = 0;
var cmd_loc = 0;

function parseCommand(c)
{
	if( c.length > 0) { 
		for(var i=0; i < c.length ; i++)
		{ 
			if(c[i] != " ") 
				return true 
		} 
	}
	else {
		return false;
	}
	return false;
}

//conver the space in commans to nbsp to be used by browser
function cmdinHTML(cmd)
{
	var tmp = "";
	for(var i = 0;i < cmd.length ; i++)
	{
		if(cursor == i) tmp  +=  "<span id='carot'>";
		if( cmd.charAt(i) == " " )
		{
			tmp += "&nbsp;";
		}
		else 
		{
			tmp += cmd.charAt(i);
		}
		if(cursor == i) tmp += "</span>"
	}
	if( i == cursor) tmp += "<span id='carot'>&nbsp;</span>";
	return tmp;

}

function printPrompt(cmd)
{
	var content = document.getElementById("prompt");
	content.innerHTML = "[" + user + "@" + system + "]:~$&nbsp;" + cmdinHTML(cmd);
}

//add output to table in html body
function addtoTable(output)
{
	var table = document.getElementById("terminal");
	var tbody = document.getElementById("t_body");
	var row  = document.createElement("tr");
	var data = document.createElement("td");
	var rows = document.getElementById("prompt");

	//add the executed command along with prompt to the row
	var tmp =  "[" + user + "@" + system + "]:~$&nbsp;" + command;
	data.innerHTML = tmp ;
	row.appendChild(data);
	tbody.insertBefore(row,rows);
	
	//add the output now
	rows = document.getElementById("prompt");
	var data1 = document.createElement("td");
	data1.innerHTML = output;
	var row1 = document.createElement("tr");
	row1.appendChild(data1);
	tbody.insertBefore(row1,rows);

}

function termDisplay(key)
{
	if(isFinite(key))
	{
		
		switch( key )
		{
			case 13:		
				//Enter
				//Only process command if its not empty
				if(parseCommand(command))
				{
					var command_result = processCommands(command);
					//document.getElementById("prompt").innerHTML = command_result;

					addtoTable(command_result); 

					//add it to history
					cmd_hist[history_index++] = command;
					cmd_loc = cmd_hist.length ;
				}				
				command = "";
				cursor = 0;
			break;
			
			case 32:			//Space
				if(cursor < command.length)
				{
					command = command.slice(0,cursor) + " " + command.slice(cursor,command.length);
					cursor++;
				}
				else
				{
					command += " ";
					cursor++;
				}
			break;

			case 8:				//backspace key
				if(cursor > 0)
				{
					if(cursor == command.length){
						command = command.slice(0,command.length-1);
						cursor--;
					}
					else
					{
						command = command.slice(0,cursor-1) + command.slice(cursor,command.length);
						cursor--;
					}
				}
			break;
			
			//left arrow
			case 37:
				if(cursor > 0 )	cursor--;
			break;
			
			//Up arrow
			case 38:
				if(cmd_hist.length > 0 && cmd_loc > 0)
				{
					if(cmd_loc == cmd_hist.length)
					{		
						tmp_cmd = command;
						tmp_cursor = cursor;

						command = cmd_hist[--cmd_loc];
						cursor = command.length;
					}
					else
					{

						command = cmd_hist[--cmd_loc];
						cursor = command.length;
					}
				}
			break;

			//Right arrow
			case 39:
				if(cursor < command.length)	cursor++;
			break;

			//Down arrow
			case 40:
				if(cmd_hist.length > 0 && cmd_loc < cmd_hist.length)
				{
					console.log(cmd_loc);
					if(cmd_loc == ( cmd_hist.length - 1) )
					{
						command = tmp_cmd;
						cursor = tmp_cursor;
						cmd_loc++;
					}
					else
					{
						command = cmd_hist[++cmd_loc];
						cursor = command.length;
					}
				}	
			break;

			default:break;
			
		}
	}
	else
	{
		if(cursor == command.length)
		{
			command += key;
			cursor++;
		}
		else
		{
			command = command.slice(0,cursor) + key + command.slice(cursor,command.length);
			cursor++;
		}
	}
	printPrompt(command);
	return true;
}

function firstResponse(event)
{
	event = event || window.event;
	if( event && event.metaKey) return true;

	//Prevent browser from taking default actions
	if(window.event && window,event.preventDefault())
	{
		window.event.preventDefault();
	}
	else if(event && event.preventDefault()) event.preventDefault();

	//stop the event propagating from inner elements to outer elemens
	if(window.event && window.event.stopPropagation) window.event.stopPropagation();
	else if( event && event.stopPropagation) event.stopPropagation();
	
	//add functions and routines that prevent Default action and Propagation
	//TODO add preventDefault and stopPropagation fot other browsers

	//Now read what character has been pressed
	var Key = event.keyCode || event.which;

	//Allow default behaviour for Function keys
	//TODO : try to make it work 
	if(Key >= 112 && Key <= 123)	
	{			
		event.cancelBubble = false;
		return true;
	}

	//console.log(Key);
	
							//if an alphabet
	if( Key >= 65 && Key <=90 )
	{
		c = alphabet[Key-65];
		termDisplay(c);
	}else 						//If key is a numeric value both numpad and normal keys
	if( (Key >= 48 && Key <= 57) || (Key >= 96 && Key <= 105) )
	{	
		if(Key < 96)
		c = numbers[Key - 48];
		else c = numbers[Key - 96]		//Numpad keys

		termDisplay(c);
	}
	else 						//if input is a space or backspace or enter
	if( (Key == 32) || (Key == 8) || (Key == 13) || Key == 37 || Key == 40 || Key == 38 || Key == 39)
	{
		termDisplay(Key);	
	}

	return true;
}

function Init()
{
	window.document.addEventListener('keydown',firstResponse,1);
}
