function processCommands(cmd)
{
	var res = "";
	
	if(cmd === "date")
	{
		res = (new Date());
		return res;
	}

	if(cmd === "time")
	{
		res = (new Date());
		return res;
	}

	if(cmd === "history")
	{
		for(var i = 0; i < cmd_hist.length; i++)
		{
			res += i+1 + "&nbsp;";
			res += cmd_hist[i];
			res += "<br>"
		}

		return res;
	}
	
	if(cmd == "exit")
	{
		window.history.back();
	}

	//if that command is present it would have been captured by earlier if statements
	res = cmd+": command not found";
	return	res;
}	
