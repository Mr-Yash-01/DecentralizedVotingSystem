// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Lock {
    struct Candidate {
        string firstName;
        string middleName;
        string lastName;
        string partyName;
        uint64 votes;
    }

    struct ElectionDetails {
        string electionName;
        Candidate[] candidates;
        uint256 startTime;
        uint256 endTime;
        string[] voted;  // Array to store IDs of users who have voted
    }

    struct Admin {
        string id;
        string password;
    }

    mapping(string => ElectionDetails) private elections;
    mapping(string => Admin) private admins;
    string[] private electionNames;

    event VoteCast(string electionName, string candidateName);

    modifier onlyAdmin(string memory _id, string memory _password) {
        require(
            keccak256(abi.encodePacked(admins[_id].password)) ==
                keccak256(abi.encodePacked(_password)),
            "Not an admin or incorrect password"
        );
        _;
    }

    constructor(
        string memory _initialAdminId,
        string memory _initialAdminPassword
    ) {
        admins[_initialAdminId] = Admin(_initialAdminId, _initialAdminPassword);
    }

    function addAdmin(string memory _id, string memory _password) public {
        admins[_id] = Admin(_id, _password);
    }

    function addElectionWithDetails(
        string memory _electionName,
        Candidate[] memory _candidates,
        uint256 _startTime,
        uint256 _endTime,
        string memory _adminId,
        string memory _adminPassword
    ) public onlyAdmin(_adminId, _adminPassword) {
        require(
            bytes(_electionName).length > 0,
            "Election name cannot be empty"
        );
        require(
            elections[_electionName].startTime == 0,
            "Election already exists"
        );

        ElectionDetails storage newElection = elections[_electionName];
        newElection.electionName = _electionName;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;

        for (uint256 i = 0; i < _candidates.length; i++) {
            newElection.candidates.push(
                Candidate({
                    firstName: _candidates[i].firstName,
                    middleName: _candidates[i].middleName,
                    lastName: _candidates[i].lastName,
                    partyName: _candidates[i].partyName,
                    votes: 0
                })
            );
        }

        electionNames.push(_electionName);
    }

    function vote(
        string memory _electionName,
        string memory _candidateFullName,
        string memory _voterId
    ) public {
        ElectionDetails storage election = elections[_electionName];

        // Check if the voter has already voted
        for (uint256 i = 0; i < election.voted.length; i++) {
            require(
                keccak256(abi.encodePacked(election.voted[i])) !=
                    keccak256(abi.encodePacked(_voterId)),
                "Voter has already voted"
            );
        }

        // Record the vote
        for (uint256 i = 0; i < election.candidates.length; i++) {
            Candidate storage candidate = election.candidates[i];
            string memory fullName = string(
                abi.encodePacked(
                    candidate.firstName,
                    " ",
                    candidate.middleName,
                    " ",
                    candidate.lastName
                )
            );
            if (
                keccak256(abi.encodePacked(fullName)) ==
                keccak256(abi.encodePacked(_candidateFullName))
            ) {
                candidate.votes++;
                election.voted.push(_voterId);  // Add voter's ID to the voted array
                emit VoteCast(_electionName, fullName);
                break;
            }
        }
    }

    function getCandidateVotes(
        string memory _electionName,
        string memory _candidateFullName
    ) public view returns (uint256) {
        ElectionDetails storage election = elections[_electionName];
        for (uint256 i = 0; i < election.candidates.length; i++) {
            Candidate storage candidate = election.candidates[i];
            string memory fullName = string(
                abi.encodePacked(
                    candidate.firstName,
                    " ",
                    candidate.middleName,
                    " ",
                    candidate.lastName
                )
            );
            if (
                keccak256(abi.encodePacked(fullName)) ==
                keccak256(abi.encodePacked(_candidateFullName))
            ) {
                return candidate.votes;
            }
        }
        return 0;
    }

    function getCandidateNames(
        string memory _electionName
    ) public view returns (string[] memory) {
        ElectionDetails storage election = elections[_electionName];
        string[] memory candidateNames = new string[](
            election.candidates.length
        );
        for (uint256 i = 0; i < election.candidates.length; i++) {
            candidateNames[i] = string(
                abi.encodePacked(
                    election.candidates[i].firstName,
                    " ",
                    election.candidates[i].middleName,
                    " ",
                    election.candidates[i].lastName
                )
            );
        }
        return candidateNames;
    }

    function getElectionResult(
        string memory _electionName
    ) public view returns (string memory, Candidate[] memory, string[] memory) {
        ElectionDetails storage election = elections[_electionName];
        return (election.electionName, election.candidates, election.voted);
    }

    function getAllElectionNames() public view returns (string[] memory) {
        return electionNames;
    }

    function getElectionDetails(
        string memory _electionName
    ) public view returns (ElectionDetails memory) {
        return elections[_electionName];
    }

    function getAllElections()
        public
        view
        returns (string[] memory, ElectionDetails[] memory)
    {
        uint256 count = electionNames.length;
        string[] memory names = new string[](count);
        ElectionDetails[] memory details = new ElectionDetails[](count);

        for (uint256 i = 0; i < count; i++) {
            names[i] = electionNames[i];
            details[i] = elections[electionNames[i]];
        }

        return (names, details);
    }

    function verifyAdmin(
        string memory _id,
        string memory _password
    ) public view returns (bool) {
        Admin storage admin = admins[_id];
        if (
            keccak256(abi.encodePacked(admin.password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            return true;
        } else {
            return false;
        }
    }
}
