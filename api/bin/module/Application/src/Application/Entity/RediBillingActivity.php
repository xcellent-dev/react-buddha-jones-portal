<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediBillingActivity
 *
 * @ORM\Table(name="redi_billing_activity")
 * @ORM\Entity
 */
class RediBillingActivity
{
    /**
     * @var integer
     *
     * @ORM\Column(name="bill_id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $billId;

    /**
     * @var integer
     *
     * @ORM\Column(name="activity_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $activityId;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $price;

    /**
     * @var string
     *
     * @ORM\Column(name="hour", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $hour;



    /**
     * Set billId
     *
     * @param integer $billId
     * @return RediBillingActivity
     */
    public function setBillId($billId)
    {
        $this->billId = $billId;

        return $this;
    }

    /**
     * Get billId
     *
     * @return integer 
     */
    public function getBillId()
    {
        return $this->billId;
    }

    /**
     * Set activityId
     *
     * @param integer $activityId
     * @return RediBillingActivity
     */
    public function setActivityId($activityId)
    {
        $this->activityId = $activityId;

        return $this;
    }

    /**
     * Get activityId
     *
     * @return integer 
     */
    public function getActivityId()
    {
        return $this->activityId;
    }

    /**
     * Set price
     *
     * @param string $price
     * @return RediBillingActivity
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return string 
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Set hour
     *
     * @param string $hour
     * @return RediBillingActivity
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
}
