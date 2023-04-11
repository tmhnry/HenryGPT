#!/user/bin/env node

import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';
import inquirer from 'inquirer';
import terminalKit from 'terminal-kit';
import { createSpinner } from 'nanospinner';

let flag = true;

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
var term = terminalKit.terminal;

async function handleSubmit(prompt){
	if(prompt == 'QUIT'){
		flag = false;
		console.log('GPT has left the chat.');
		process.exit(0);
	}

	const response = await fetch('http://localhost:5000', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			prompt: prompt
		})
	})

	return handleAnswer(response);

}

async function handlePrompt(){
	const prompt = await inquirer.prompt({
		name: 'question',
		type: 'input',
		message: 'Ask GPT anything. Type QUIT to quit.\n',
		default(){
			return '';
		},
	});

	return handleSubmit(prompt.question);
}

async function handleAnswer(response){
	const spinner = createSpinner('GPT is thinking...').start();
	await sleep();
	if(response.ok){
		const data = await response.json();
		const parsedData = data.bot.trim();
		spinner.success({ text: ' ' });
		// spinner.success({ text: ' ' + parsedData });
		await term.slowTyping(parsedData + '\n', { delay: 50, flashStyle: term.brightWhite });
	}

	else {
		spinner.error({ text: 'Something went wrong!' });
	}
}

async function run(){
	console.clear();
	while(flag){
		await handlePrompt();
	}
}

run();
