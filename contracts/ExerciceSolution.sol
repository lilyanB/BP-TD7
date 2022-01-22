pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./ERC20TD.sol";
import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";
import "./ERC20Mintable.sol";

contract ExerciceSolution is ERC20
{
	mapping(address => uint256) public tokenvalue;
	ERC20Claimable myerc20claimable;
	ERC20Mintable myerc20mintable;
	constructor(string memory name_, string memory symbol_,ERC20Claimable claimable, ERC20Mintable mintable) public ERC20(name_, symbol_) 
	{
	   myerc20claimable = claimable;
	   myerc20mintable = mintable;
	}

	function claimTokensOnBehalf() external 
	{
		/*uint256 initbalance = myerc20claimable.balanceOf(address(this));
		myerc20claimable.claimTokens();
		uint256 endbalance = myerc20claimable.balanceOf(address(this));
        tokenvalue[msg.sender]+=endbalance-initbalance;*/

		uint256 initbalance = myerc20claimable.balanceOf(address(this));
		myerc20claimable.claimTokens();
		uint256 endbalance = myerc20claimable.balanceOf(address(this));
        myerc20mintable.mint(msg.sender,endbalance-initbalance);
	}

	function tokensInCustody(address callerAddress) external returns (uint256)
	{
		return myerc20mintable.balanceOf(msg.sender);
	}

	function withdrawTokens(uint256 amountToWithdraw) external returns (uint256)
	{
		
		/*require(amountToWithdraw <= myerc20claimable.balanceOf(address(this)),"error");
		myerc20claimable.transfer(msg.sender, amountToWithdraw);
		tokenvalue[msg.sender]=tokenvalue[msg.sender]-amountToWithdraw;
		return tokenvalue[msg.sender];*/

		require(amountToWithdraw <= myerc20claimable.balanceOf(address(this)),"error");
		myerc20claimable.transfer(msg.sender, amountToWithdraw);
		myerc20mintable.burn(msg.sender, amountToWithdraw);
		return myerc20mintable.balanceOf(msg.sender);

	}

	function depositTokens(uint256 amountToWithdraw) external returns (uint256)
	{

		/*require(amountToWithdraw <= myerc20claimable.balanceOf(address(this)),"error2");
		myerc20claimable.transferFrom(msg.sender, address(this), amountToWithdraw);
		tokenvalue[msg.sender]=tokenvalue[msg.sender]+amountToWithdraw;
		return tokenvalue[msg.sender];*/

		require(amountToWithdraw <= myerc20claimable.balanceOf(address(this)),"error2");
		myerc20claimable.transferFrom(msg.sender, address(this), amountToWithdraw);
		myerc20mintable.mint(msg.sender, amountToWithdraw);
		return myerc20mintable.balanceOf(msg.sender);
	}

	function getERC20DepositAddress() external returns (address)
	{
		return address(myerc20mintable);
	}
}
