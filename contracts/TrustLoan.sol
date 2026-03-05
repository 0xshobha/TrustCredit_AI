// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrustLoan - Decentralized AI-Powered Credit Lending
 * @notice Manages user profiles, trust scores, and loan lifecycle on Creditcoin
 * @dev Score-gated lending with tiered interest rates based on AI trust scores
 */
contract TrustLoan {
    // ══════════════════════════════════════════════════════════════════════
    //                            STRUCTS
    // ══════════════════════════════════════════════════════════════════════

    struct UserProfile {
        address wallet;
        uint256 trustScore;       // 0 - 1000
        uint256 totalLoans;
        uint256 repaidLoans;
        uint256 defaultedLoans;
        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 registeredAt;
        bool exists;
    }

    struct Loan {
        uint256 id;
        address borrower;
        address lender;
        uint256 amount;
        uint256 interestRate;     // basis points (e.g., 600 = 6%)
        uint256 duration;         // in seconds
        uint256 repayAmount;
        uint256 startTime;
        uint256 dueDate;
        LoanStatus status;
    }

    struct ReputationAttestation {
        address attester;
        address subject;
        string attestationType; // "employer", "dao", "peer"
        string message;
        uint256 timestamp;
    }

    enum LoanStatus {
        Requested,
        Approved,
        Active,
        Repaid,
        Defaulted,
        Liquidated
    }

    // ══════════════════════════════════════════════════════════════════════
    //                          STATE VARIABLES
    // ══════════════════════════════════════════════════════════════════════

    address public owner;
    uint256 public loanCounter;
    uint256 public totalLiquidity;
    uint256 public constant MIN_TRUST_SCORE = 400;
    uint256 public constant MAX_LOAN_DURATION = 365 days;

    mapping(address => UserProfile) public profiles;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;
    mapping(address => uint256) public lenderDeposits;
    mapping(address => ReputationAttestation[]) public attestations;

    // ══════════════════════════════════════════════════════════════════════
    //                             EVENTS
    // ══════════════════════════════════════════════════════════════════════

    event ProfileCreated(address indexed user, uint256 timestamp);
    event TrustScoreUpdated(address indexed user, uint256 oldScore, uint256 newScore);
    event LiquidityDeposited(address indexed lender, uint256 amount);
    event LiquidityWithdrawn(address indexed lender, uint256 amount);
    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanLiquidated(uint256 indexed loanId);
    event AttestationAdded(address indexed attester, address indexed subject, string attestationType);

    // ══════════════════════════════════════════════════════════════════════
    //                            MODIFIERS
    // ══════════════════════════════════════════════════════════════════════

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier profileExists(address _user) {
        require(profiles[_user].exists, "Profile does not exist");
        _;
    }

    // ══════════════════════════════════════════════════════════════════════
    //                          CONSTRUCTOR
    // ══════════════════════════════════════════════════════════════════════

    constructor() {
        owner = msg.sender;
    }

    // ══════════════════════════════════════════════════════════════════════
    //                       PROFILE MANAGEMENT
    // ══════════════════════════════════════════════════════════════════════

    function createProfile() external {
        require(!profiles[msg.sender].exists, "Profile already exists");

        profiles[msg.sender] = UserProfile({
            wallet: msg.sender,
            trustScore: 0,
            totalLoans: 0,
            repaidLoans: 0,
            defaultedLoans: 0,
            totalBorrowed: 0,
            totalRepaid: 0,
            registeredAt: block.timestamp,
            exists: true
        });

        emit ProfileCreated(msg.sender, block.timestamp);
    }

    function updateTrustScore(address _user, uint256 _newScore)
        external
        onlyOwner
        profileExists(_user)
    {
        require(_newScore <= 1000, "Score cannot exceed 1000");
        uint256 oldScore = profiles[_user].trustScore;
        profiles[_user].trustScore = _newScore;
        emit TrustScoreUpdated(_user, oldScore, _newScore);
    }

    // ══════════════════════════════════════════════════════════════════════
    //                       REPUTATION SYSTEM
    // ══════════════════════════════════════════════════════════════════════

    function addAttestation(
        address _subject,
        string calldata _type,
        string calldata _message
    ) external profileExists(_subject) {
        require(msg.sender != _subject, "Cannot attest yourself");

        attestations[_subject].push(ReputationAttestation({
            attester: msg.sender,
            subject: _subject,
            attestationType: _type,
            message: _message,
            timestamp: block.timestamp
        }));

        emit AttestationAdded(msg.sender, _subject, _type);
    }

    // ══════════════════════════════════════════════════════════════════════
    //                        LIQUIDITY POOL
    // ══════════════════════════════════════════════════════════════════════

    function depositLiquidity() external payable {
        require(msg.value > 0, "Must deposit more than 0");
        lenderDeposits[msg.sender] += msg.value;
        totalLiquidity += msg.value;
        emit LiquidityDeposited(msg.sender, msg.value);
    }

    function withdrawLiquidity(uint256 _amount) external {
        require(lenderDeposits[msg.sender] >= _amount, "Insufficient deposit");
        require(totalLiquidity >= _amount, "Insufficient pool liquidity");

        lenderDeposits[msg.sender] -= _amount;
        totalLiquidity -= _amount;

        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Transfer failed");

        emit LiquidityWithdrawn(msg.sender, _amount);
    }

    // ══════════════════════════════════════════════════════════════════════
    //                         LOAN LIFECYCLE
    // ══════════════════════════════════════════════════════════════════════

    function requestLoan(uint256 _amount, uint256 _duration)
        external
        profileExists(msg.sender)
    {
        require(profiles[msg.sender].trustScore >= MIN_TRUST_SCORE, "Trust score too low");
        require(_duration <= MAX_LOAN_DURATION, "Duration exceeds maximum");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 interestRate = _calculateInterestRate(profiles[msg.sender].trustScore);
        uint256 repayAmount = _amount + (_amount * interestRate / 10000);

        loanCounter++;

        loans[loanCounter] = Loan({
            id: loanCounter,
            borrower: msg.sender,
            lender: address(0),
            amount: _amount,
            interestRate: interestRate,
            duration: _duration,
            repayAmount: repayAmount,
            startTime: 0,
            dueDate: 0,
            status: LoanStatus.Requested
        });

        userLoans[msg.sender].push(loanCounter);
        profiles[msg.sender].totalLoans++;

        emit LoanRequested(loanCounter, msg.sender, _amount);
    }

    function approveLoan(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Requested, "Loan not in requested state");
        require(lenderDeposits[msg.sender] >= loan.amount, "Insufficient lender funds");

        loan.lender = msg.sender;
        loan.status = LoanStatus.Active;
        loan.startTime = block.timestamp;
        loan.dueDate = block.timestamp + loan.duration;

        lenderDeposits[msg.sender] -= loan.amount;
        totalLiquidity -= loan.amount;
        profiles[loan.borrower].totalBorrowed += loan.amount;

        (bool sent, ) = payable(loan.borrower).call{value: loan.amount}("");
        require(sent, "Transfer to borrower failed");

        emit LoanApproved(_loanId, msg.sender);
    }

    function repayLoan(uint256 _loanId) external payable {
        Loan storage loan = loans[_loanId];
        require(loan.borrower == msg.sender, "Not borrower");
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.value >= loan.repayAmount, "Insufficient repayment");

        loan.status = LoanStatus.Repaid;
        profiles[msg.sender].repaidLoans++;
        profiles[msg.sender].totalRepaid += msg.value;

        lenderDeposits[loan.lender] += msg.value;
        totalLiquidity += msg.value;

        emit LoanRepaid(_loanId, msg.sender, msg.value);
    }

    function liquidateLoan(uint256 _loanId) external onlyOwner {
        Loan storage loan = loans[_loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(block.timestamp > loan.dueDate, "Loan not yet due");

        loan.status = LoanStatus.Liquidated;
        profiles[loan.borrower].defaultedLoans++;

        // Reduce trust score on default
        if (profiles[loan.borrower].trustScore >= 100) {
            profiles[loan.borrower].trustScore -= 100;
        } else {
            profiles[loan.borrower].trustScore = 0;
        }

        emit LoanLiquidated(_loanId);
    }

    // ══════════════════════════════════════════════════════════════════════
    //                         VIEW FUNCTIONS
    // ══════════════════════════════════════════════════════════════════════

    function getProfile(address _user) external view returns (UserProfile memory) {
        return profiles[_user];
    }

    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    function getUserLoans(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }

    function getAttestations(address _user) external view returns (ReputationAttestation[] memory) {
        return attestations[_user];
    }

    function getLoanLimit(address _user) external view returns (uint256) {
        uint256 score = profiles[_user].trustScore;
        if (score < MIN_TRUST_SCORE) return 0;
        // Linear scaling: 400 score = 500 USDC, 1000 score = 5000 USDC
        return (score - 300) * 1e16; // Returns in wei
    }

    // ══════════════════════════════════════════════════════════════════════
    //                       INTERNAL FUNCTIONS
    // ══════════════════════════════════════════════════════════════════════

    function _calculateInterestRate(uint256 _trustScore) internal pure returns (uint256) {
        if (_trustScore >= 900) return 300;   // 3%
        if (_trustScore >= 800) return 450;   // 4.5%
        if (_trustScore >= 700) return 600;   // 6%
        if (_trustScore >= 600) return 800;   // 8%
        if (_trustScore >= 500) return 1000;  // 10%
        return 1200;                           // 12%
    }
}
