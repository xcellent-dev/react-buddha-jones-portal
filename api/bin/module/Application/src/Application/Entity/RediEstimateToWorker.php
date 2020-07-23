<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEstimateToWorker
 *
 * @ORM\Table(name="redi_estimate_to_worker")
 * @ORM\Entity
 */
class RediEstimateToWorker
{
    /**
     * @var integer
     *
     * @ORM\Column(name="estimate_id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $estimateId;

    /**
     * @var integer
     *
     * @ORM\Column(name="worker_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $workerId;

    /**
     * @var string
     *
     * @ORM\Column(name="hourly_rate", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $hourlyRate;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_regular", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedRegular;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_overtime", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedOvertime;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_doubletime", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedDoubletime;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_regular_hour", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedRegularHour;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_overtime_hour", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedOvertimeHour;

    /**
     * @var string
     *
     * @ORM\Column(name="estimated_doubletime_hour", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $estimatedDoubletimeHour;

    /**
     * @var string
     *
     * @ORM\Column(name="total_amount", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $totalAmount;



    /**
     * Set estimateId
     *
     * @param integer $estimateId
     * @return RediEstimateToWorker
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
     * Set workerId
     *
     * @param integer $workerId
     * @return RediEstimateToWorker
     */
    public function setWorkerId($workerId)
    {
        $this->workerId = $workerId;

        return $this;
    }

    /**
     * Get workerId
     *
     * @return integer 
     */
    public function getWorkerId()
    {
        return $this->workerId;
    }

    /**
     * Set hourlyRate
     *
     * @param string $hourlyRate
     * @return RediEstimateToWorker
     */
    public function setHourlyRate($hourlyRate)
    {
        $this->hourlyRate = $hourlyRate;

        return $this;
    }

    /**
     * Get hourlyRate
     *
     * @return string 
     */
    public function getHourlyRate()
    {
        return $this->hourlyRate;
    }

    /**
     * Set estimatedRegular
     *
     * @param string $estimatedRegular
     * @return RediEstimateToWorker
     */
    public function setEstimatedRegular($estimatedRegular)
    {
        $this->estimatedRegular = $estimatedRegular;

        return $this;
    }

    /**
     * Get estimatedRegular
     *
     * @return string 
     */
    public function getEstimatedRegular()
    {
        return $this->estimatedRegular;
    }

    /**
     * Set estimatedOvertime
     *
     * @param string $estimatedOvertime
     * @return RediEstimateToWorker
     */
    public function setEstimatedOvertime($estimatedOvertime)
    {
        $this->estimatedOvertime = $estimatedOvertime;

        return $this;
    }

    /**
     * Get estimatedOvertime
     *
     * @return string 
     */
    public function getEstimatedOvertime()
    {
        return $this->estimatedOvertime;
    }

    /**
     * Set estimatedDoubletime
     *
     * @param string $estimatedDoubletime
     * @return RediEstimateToWorker
     */
    public function setEstimatedDoubletime($estimatedDoubletime)
    {
        $this->estimatedDoubletime = $estimatedDoubletime;

        return $this;
    }

    /**
     * Get estimatedDoubletime
     *
     * @return string 
     */
    public function getEstimatedDoubletime()
    {
        return $this->estimatedDoubletime;
    }

    /**
     * Set estimatedRegularHour
     *
     * @param string $estimatedRegularHour
     * @return RediEstimateToWorker
     */
    public function setEstimatedRegularHour($estimatedRegularHour)
    {
        $this->estimatedRegularHour = $estimatedRegularHour;

        return $this;
    }

    /**
     * Get estimatedRegularHour
     *
     * @return string 
     */
    public function getEstimatedRegularHour()
    {
        return $this->estimatedRegularHour;
    }

    /**
     * Set estimatedOvertimeHour
     *
     * @param string $estimatedOvertimeHour
     * @return RediEstimateToWorker
     */
    public function setEstimatedOvertimeHour($estimatedOvertimeHour)
    {
        $this->estimatedOvertimeHour = $estimatedOvertimeHour;

        return $this;
    }

    /**
     * Get estimatedOvertimeHour
     *
     * @return string 
     */
    public function getEstimatedOvertimeHour()
    {
        return $this->estimatedOvertimeHour;
    }

    /**
     * Set estimatedDoubletimeHour
     *
     * @param string $estimatedDoubletimeHour
     * @return RediEstimateToWorker
     */
    public function setEstimatedDoubletimeHour($estimatedDoubletimeHour)
    {
        $this->estimatedDoubletimeHour = $estimatedDoubletimeHour;

        return $this;
    }

    /**
     * Get estimatedDoubletimeHour
     *
     * @return string 
     */
    public function getEstimatedDoubletimeHour()
    {
        return $this->estimatedDoubletimeHour;
    }

    /**
     * Set totalAmount
     *
     * @param string $totalAmount
     * @return RediEstimateToWorker
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
