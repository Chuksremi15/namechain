//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@ensdomains/ens-contracts/contracts/wrapper/INameWrapper.sol";

error FailedToWithdraw();
error AmountIsTooLarge(uint256 amount, uint256 balance);

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author Chuksremi
 */
contract RegisterName is Ownable {
	INameWrapper public nameWrapper;
	bool public locked;
	string topdomain = "eth";
	bytes32 emptyNamehash = 0x00;
	uint256 price = 0.002 ether;

	event SubdomainCreated(
		address indexed creator,
		address indexed owner,
		string subdomain,
		string domain,
		string topdomain
	);

	event Withdrawal(uint256 amount);

	constructor(address _nameWrapper) {
		nameWrapper = INameWrapper(_nameWrapper);
		locked = false;
	}

	/**
	 * @dev Allows to create a subdomain (e.g. "remi.startonchain.eth"),
	 * set its resolver and set its target address
	 * @param _subdomain - sub domain name only e.g. "radek"
	 * @param _domain - domain name e.g. "startonchain"
	 * @param _owner - address that will become owner of this new subdomain
	 * @param _fuses - address that this new domain will resolve to
	 * @param _expiry - address that this new domain will resolve to
	 */
	function newSubdomain(
		string calldata _subdomain,
		string calldata _domain,
		address _owner,
		uint32 _fuses,
		uint64 _expiry
	) public payable {
		require(msg.value >= price, "Failed to send enough value");

		//create namehash for the topdomain
		bytes32 topdomainNamehash = keccak256(
			abi.encodePacked(
				emptyNamehash,
				keccak256(abi.encodePacked(topdomain))
			)
		);
		//create namehash for the domain
		bytes32 domainNamehash = keccak256(
			abi.encodePacked(
				topdomainNamehash,
				keccak256(abi.encodePacked(_domain))
			)
		);

		//create new subdomain, temporarily this smartcontract is the owner
		nameWrapper.setSubnodeOwner(
			domainNamehash,
			_subdomain,
			_owner,
			_fuses,
			_expiry
		);

		emit SubdomainCreated(
			msg.sender,
			_owner,
			_subdomain,
			_domain,
			topdomain
		);
	}

	/**
	 * Function that allows the owner to withdraw the price paid to the contract  for individual domain
	 */
	function withdraw(
		address payable addr,
		uint256 amount
	) external payable onlyOwner {
		uint256 balance = address(this).balance;
		if (amount > balance) {
			revert AmountIsTooLarge(amount, balance);
		}

		(bool success, ) = addr.call{ value: amount }("");
		if (!success) {
			revert FailedToWithdraw();
		}
		emit Withdrawal(amount);
	}

	/**
	 * Function that allows the contract to receive ETH
	 */
	receive() external payable {}
}
