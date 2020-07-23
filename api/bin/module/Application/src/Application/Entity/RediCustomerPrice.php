<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediCustomerPrice
 *
 * @ORM\Table(name="redi_customer_price")
 * @ORM\Entity
 */
class RediCustomerPrice
{
    /**
     * @var integer
     *
     * @ORM\Column(name="customer_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $customerId;

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
     * Set customerId
     *
     * @param integer $customerId
     * @return RediCustomerPrice
     */
    public function setCustomerId($customerId)
    {
        $this->customerId = $customerId;

        return $this;
    }

    /**
     * Get customerId
     *
     * @return integer 
     */
    public function getCustomerId()
    {
        return $this->customerId;
    }

    /**
     * Set activityId
     *
     * @param integer $activityId
     * @return RediCustomerPrice
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
     * @return RediCustomerPrice
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
}
