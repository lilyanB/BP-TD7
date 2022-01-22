var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var ExerciceSolution = artifacts.require("ExerciceSolution.sol");
var ERC20Mintable = artifacts.require("ERC20Mintable.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
		//await rinkebyToken(deployer, network, accounts);
        await deployRecap(deployer, network, accounts); 
		await claimToken(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-101","TD-ERC20-101",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken","CLTK",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function rinkebyToken(deployer, network, accounts) {
	TDToken = await TDErc20.at("0x77dAe18835b08A75490619DF90a3Fa5f4120bB2E")
	Evaluator = await evaluator.at("0x384C00Ff43Ed5376F2d7ee814677a15f3e330705")
    ClaimableToken = await ERC20Claimable.at("0xb5d82FEE98d62cb7Bc76eabAd5879fa4b29fFE94")
}

async function claimToken(deployer, network, accounts) {
	account = accounts[1];
	getBalance = await TDToken.balanceOf(account);
	console.log("Init balance : " + getBalance.toString());


	//ex1
	await ClaimableToken.claimTokens({from: account});
	await Evaluator.ex1_claimedPoints({from: account});
	getBalance = await TDToken.balanceOf(account);
	console.log("Ex1 balance : " + getBalance.toString());

	//ex2
	exMint= await ERC20Mintable.new("ERC","ERC", {from:account})
	ExSol = await ExerciceSolution.new("ERC","ERC",ClaimableToken.address,exMint.address,{from:account})
	await exMint.setMinter(ExSol.address,true)
	await ExSol.claimTokensOnBehalf({from: account});
	await Evaluator.submitExercice(ExSol.address, {from: account});
	await Evaluator.ex2_claimedFromContract({from: account});
	getBalance = await TDToken.balanceOf(account);
	console.log("Ex2 balance : " + getBalance.toString());


	//ex3
	await Evaluator.ex3_withdrawFromContract({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex3 balance : " + getBalance.toString());

	//ex4
	//approve avec valeur >0
	await ClaimableToken.approve(ExSol.address,10,{from:account}) > 0
	await Evaluator.ex4_approvedExerciceSolution({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex4 balance : " + getBalance.toString());

	//ex5
	//approve avec valeur =0
	await ClaimableToken.approve(ExSol.address,0,{from:account}) == 0
	await Evaluator.ex5_revokedExerciceSolution({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex5 balance : " + getBalance.toString());

	//ex6
	await Evaluator.ex6_depositTokens({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex6 balance : " + getBalance.toString());

	//ex7
	await Evaluator.ex7_createERC20({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex7 balance : " + getBalance.toString());

	//ex8
	await Evaluator.ex8_depositAndMint({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex8 balance : " + getBalance.toString());

	//ex9
	await Evaluator.ex9_withdrawAndBurn({from: accounts[1]});
	getBalance = await TDToken.balanceOf(accounts[1]);
	console.log("Ex9 balance : " + getBalance.toString());

	

}







