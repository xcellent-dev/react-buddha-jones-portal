<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEstimateTemporaryStaff
 *
 * @ORM\Table(name="redi_estimate_temporary_staff")
 * @ORM\Entity
 */
class RediEstimateTemporaryStaff
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
     * @ORM\Column(name="estimate_id", type="bigint", nullable=true)
     */
    private $estimateId;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=200, nullable=true)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_time", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedTime;

    /**
     * @var string
     *
     * @ORM\Column(name="hour", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $hour;

    /**
     * @var string
     *
     * @ORM\Column(name="rate", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $rate;

    /**
     * @var string
     *
     * @ORM\Column(name="total_amount", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $totalAmount;



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
     * @return RediEstimateTemporaryStaff
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
     * Set name
     *
     * @param string $name
     * @return RediEstimateTemporaryStaff
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set estimatedTime
     *
     * @param string $estimatedTime
     * @return RediEstimateTemporaryStaff
     */
    public function setEstimatedTime($estimatedTime)
    {
        $this->estimatedTime = $estimatedTime;

        return $this;
    }

    /**
     * Get estimatedTime
     *
     * @return string 
     */
    public function getEstimatedTime()
    {
        return $this->estimatedTime;
    }

    /**
     * Set hour
     *
     * @param string $hour
     * @return RediEstimateTemporaryStaff
     */
    public function setHour($hour)
    {
        $this->hour = $hour;

        return $this;
    }

    /**
     * Get hour
     *
     * @return string 
     */
    public function getHour()
    {
        return $this->hour;
    }

    /**
     * Set rate
     *
     * @param string $rate
     * @return RediEstimateTemporaryStaff
     */
    public function setRate($rate)
    {
        $this->rate = $rate;

        return $this;
    }

    /**
     * Get rate
     *
     * @return string 
     */
    public function getRate()
    {
        return $this->rate;
    }

    /**
     * Set totalAmount
     *
     * @param string $totalAmount
     * @return RediEstimateTemporaryStaff
     */
    public function setTotalAmount($totalAmount)
    {
        $this->totalAmount = $totalAmount;

        return $this;
    }

    /**
     * Get totalAmount
     *
     * @return string 
     */
    public function getTotalAmount()
    {
        return $this->totalAmount;
    }
}
