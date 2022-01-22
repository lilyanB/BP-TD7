pragma solidity ^0.6.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IERC20Mintable.sol";

contract ERC20Mintable is ERC20
{   

 	mapping(address => bool) public Mint;

	constructor (string memory name_, string memory symbol_) public ERC20(name_, symbol_){}

	function setMinter(address minterAddress, bool isMinter)  external{
		Mint[minterAddress] = isMinter;
	}

	function mint(address toAddress, uint256 amount)  external{
		require(Mint[msg.sender],"error mint");
		_mint(toAddress, amount);
	}

	function burn(address toAddress, uint256 amount)  external{
		require(Mint[msg.sender],"error burn");
		_burn(toAddress, amount);
	}

	function isMinter(address minterAddress) external returns (bool){
		return Mint[minterAddress];
	}
}