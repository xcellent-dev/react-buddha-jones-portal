<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEstimateHistory
 *
 * @ORM\Table(name="redi_estimate_history")
 * @ORM\Entity
 */
class RediEstimateHistory
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var integer
     *
     * @ORM\Column(name="estimate_id", type="integer", nullable=true)
     */
    private $estimateId;

    /**
     * @var integer
     *
     * @ORM\Column(name="user_id", type="integer", nullable=true)
     */
    private $userId;

    /**
     * @var string
     *
     * @ORM\Column(name="message", type="text", nullable=true)
     */
    private $message;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created_at", type="datetime", nullable=true)
     */
    private $createdAt;



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set estimateId
     *
     * @param integer $estimateId
     * @return RediEstimateHistory
     */
    public function setEstimateId($estimateId)
    {
        $this->estimateId = $estimateId;

        return $this;
    }

    /**
     * Get estimateId
     *
     * @return integer 
     */
    public function getEstimateId()
    {
        return $this->estimateId;
    }

    /**
     * Set userId
     *
     * @param integer $userId
     * @return RediEstimateHistory
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;

        return $this;
    }

    /**
     * Get userId
     *
     * @return integer 
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * Set message
     *
     * @param string $message
     * @return RediEstimateHistory
     */
    public function setMessage($message)
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Get message
     *
     * @return string 
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     * @return RediEstimateHistory
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime 
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }
}
