// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { e } from "@inco/lightning/src/Lib.sol";
import { euint256, ebool } from "@inco/lightning/src/Types.sol";

contract ConfidentialScore {
    // Mapping from user address to their encrypted credit score
    mapping(address => euint256) internal scores;

    // Event to emit when a score is updated (we don't emit the value because it's secret!)
    event ScoreUpdated(address indexed user);

    /**
     * @notice Sets the encrypted credit score for the caller.
     * @param encryptedScore The encrypted score handle (passed as euint256/bytes32).
     */
    function setScore(euint256 encryptedScore) external {
        scores[msg.sender] = encryptedScore;
        emit ScoreUpdated(msg.sender);
    }

    /**
     * @notice Checks if the caller's score is above a certain visible threshold.
     * @param threshold The plaintext threshold to check against (e.g., 700).
     * @dev Calling this will trigger a reveal request for the boolean result.
     */
    function checkEligibility(uint256 threshold) external {
        euint256 userScore = scores[msg.sender];
        // Check if score > threshold (returns encrypted boolean)
        ebool isEligible = e.gt(userScore, threshold);
        // Request decryption/reveal of the result
        e.reveal(isEligible);
    }
}
