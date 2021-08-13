pragma solidity ^0.8.3;

import "./dSocialCredits.sol";
import "./library/ABDKMath64x64.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract desilo is ERC1155Receiver {

    struct Group {
        string uri;
        int128 yield;
        uint256 acceptance;
    }

    struct Project {
        string uri; 
        uint256 createdAt; 
        uint256 groupCount;
        address owner; 
    }

    uint256 public groupCreationSCAmount;
    uint256 public scStakeAmount;
    uint256 public scSeedAmount;
    int128 public scYield;
    uint256 public scStakePeriod;

    dSocialCredits _scContract;
    address _owner;
    uint256 public scID = 2**256 - 1;
    mapping(address => bool) public registered;

    // mapping(entityID). keccak256(projectURI, entityURI)
    mapping(bytes32 => mapping(address => uint256)) _stakedAmount;
    mapping(bytes32 => mapping(address => uint256)) _stakeExpiry;
    mapping(bytes32 => uint256) _entityToThread;
    mapping(bytes32 => string) _entityURI;

    // mapping(groupID)
    mapping (uint256 => mapping(uint256 => bool)) _affiliatedGroups;
    mapping (uint256 => mapping(uint256 => uint256)) _affiliatedGroupsVouched;


    // mapping(projectID)
    mapping(uint256 => Project) _projects; 
    mapping(uint256 => uint256) _projectEntitiesCount;
    uint256 _projectCount = 0;

    // mapping(groupID => fixed128x128)
    uint256 _groupCount = 0;
    mapping(uint256 => Group) public _groups; // Group's 


    event GroupCreated(uint256 id, address creator); 
    event ProjectCreated(uint256 id, address creator); 
    event ProjectAccepted(uint256 projectId, uint256 groupId); 
    event Staked(address staker, bytes32 commitId, string uri); 
    event Unstaked(address staker, bytes32 commitId, string uri); 


    constructor(
        uint256 _scStakeAmount,
        int128 _scYield,
        uint256 _groupCreationSCAmount,
        uint256 _scSeedAmount,
        uint256 _scStakePeriod
    ) IERC1155Receiver() {
        scYield = _scYield;
        scStakeAmount = _scStakeAmount;
        groupCreationSCAmount = _groupCreationSCAmount;
        scSeedAmount = _scSeedAmount;
        scStakePeriod = _scStakePeriod;
        _owner = msg.sender;
    }

    function createGroup(uint256 _initialSupply, string memory _uri, int128 _yield, uint256 _acceptance) external {
        _scContract.burn(msg.sender, scID, groupCreationSCAmount);
        _groups[_groupCount].uri = _uri;
        _groups[_groupCount].yield = _yield;
        _groups[_groupCount].acceptance = _acceptance;

        _scContract.mint(msg.sender, _groupCount, _initialSupply, "");
        emit GroupCreated(_groupCount, msg.sender);
        _groupCount++;
    }

    function getGroup(uint256 index) external view returns(Group memory) {
        return _groups[index]; 
    }

    function getAllGroups() external view returns(Group[] memory) {
        Group[] memory groups = new Group[](_groupCount);
        for (uint i = 0; i < _groupCount; i++) groups[i] = _groups[i];
        return groups; 
    }

    function getAffiliations(uint256 projectID) external view returns(bool[] memory) {
        bool[] memory affiliations = new bool[](_groupCount);
        for (uint j = 0; j < _groupCount; j++) affiliations[j] = _affiliatedGroups[projectID][j];
        return affiliations; 
    }

    function getAllAffiliations() external view returns(bool[][] memory) {
        bool[][] memory projects = new bool[][](_projectCount);
        for (uint i = 0; i < _projectCount; i++) {
            bool[] memory affiliations = new bool[](_groupCount);
            for (uint j = 0; j < _groupCount; j++) affiliations[j] = _affiliatedGroups[i][j];
            projects[i] = affiliations;
        }
        return projects; 
    }

    function getAllVouched() external view returns(uint256[][] memory) {
        uint256[][] memory projects = new uint256[][](_projectCount);
        for (uint i = 0; i < _projectCount; i++) {
            uint256[] memory affiliations = new uint256[](_groupCount);
            for (uint j = 0; j < _groupCount; j++) affiliations[j] = _affiliatedGroupsVouched[i][j];
            projects[i] = affiliations;
        }
        return projects; 
    }

    function getProject(uint256 index) external view returns(Project memory) {
        return _projects[index]; 
    }

    function getAllProjects() external view returns(Project[] memory) {
        Project[] memory projects = new Project[](_projectCount);
        for (uint i = 0; i < _projectCount; i++) projects[i] = _projects[i];
        return projects; 
    }

    function getProjectEntities(uint256 projectID) external view returns(string[] memory entityURIs) {
        string[] memory entityURIs = new string[](_projectEntitiesCount[projectID]);
        for (uint i = 0; i < _projectEntitiesCount[projectID]; i++) {
            entityURIs[i] = _entityURI[keccak256(abi.encodePacked(_projects[projectID].uri, _projectEntitiesCount[projectID]))];
        }
    }

    function addProjectEntity(uint256 projectID, string memory entityURI) external {
        // Run Chainlink verification of ownership
        bytes32 entityID = keccak256(abi.encodePacked(_projects[projectID].uri, _projectEntitiesCount[projectID]));
        _entityToThread[entityID] = projectID;
        _entityURI[entityID] = entityURI;
        _projectEntitiesCount[projectID] += 1;
    }

    function vouchProject(uint256 projectID, uint256 groupID, uint256 amount) external {
        _scContract.burn(msg.sender, groupID, amount);
        _affiliatedGroupsVouched[projectID][groupID] += amount; 
        if (_affiliatedGroupsVouched[projectID][groupID] >= _groups[groupID].acceptance) {
            _affiliatedGroups[projectID][groupID] = true; 
            emit ProjectAccepted(projectID, groupID);
        }
    }

    function setSC(dSocialCredits _sc) external {
        require(msg.sender == _owner);
        _scContract = _sc;
    }

    function seedSC() external {
        require(
            !registered[msg.sender],
            "Cannot call this function, user already registered"
        );
        registered[msg.sender] = true;
        _scContract.mint(msg.sender, scID, scSeedAmount, "");
    }

    function getStaked(bytes32 _commitId, address _addr)
        public
        view
        returns (uint256)
    {
        return _stakedAmount[_commitId][_addr];
    }

    function stake(bytes32 _commitId) external {
        _scContract.safeTransferFrom(
            msg.sender,
            address(this),
            scID,
            scStakeAmount,
            ""
        );
        _stakedAmount[_commitId][msg.sender] += scStakeAmount;
        _stakeExpiry[_commitId][msg.sender] = block.timestamp + scStakePeriod;
        emit Staked(msg.sender, _commitId, ""); 
    }

    function unstake(bytes32 _commitId) external {
        require(
            block.timestamp >= _stakeExpiry[_commitId][msg.sender],
            "desilo: You may not yet unstake."
        );
        require(
            getStaked(_commitId, msg.sender) >= 0,
            "desilo: You have not yet staked."
        );

        uint256 stakedAmount = getStaked(_commitId, msg.sender);
        uint256 threadID = _entityToThread[_commitId];
        uint256 gscCount = _projects[threadID].groupCount;
        uint256[] memory ids = new uint256[](gscCount);
        uint256[] memory amounts = new uint256[](gscCount);

        _stakedAmount[_commitId][msg.sender] -= stakedAmount;
        _stakeExpiry[_commitId][msg.sender] = 0;

        _scContract.safeTransferFrom(
            address(this),
            msg.sender,
            scID,
            stakedAmount,
            ""
        );
        _scContract.mint(
            msg.sender,
            scID,
            ABDKMath64x64.mulu(scYield, stakedAmount),
            ""
        );

        uint256 count = 0;
        for (uint256 i = 0; i < _groupCount; i++) {
            if (_affiliatedGroups[threadID][i]) {
                ids[count] = i;
                amounts[count] = ABDKMath64x64.mulu(_groups[i].yield, stakedAmount);
                count++;
            }
        }
        _scContract.mintBatch(msg.sender, ids, amounts, "");
        emit Unstaked(msg.sender, _commitId, ""); 
    }

    function registerProject(string memory uri) external {
        _projects[_projectCount].uri = uri;
        _projects[_projectCount].owner = msg.sender; 
        _projects[_projectCount].createdAt = block.timestamp; 
        emit ProjectCreated(_projectCount, msg.sender);
        _projectCount++; 
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}
