<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEstimateToOutsideCost
 *
 * @ORM\Table(name="redi_estimate_to_outside_cost")
 * @ORM\Entity
 */
class RediEstimateToOutsideCost
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
     * @var integer
     *
     * @ORM\Column(name="outside_cost_id", type="integer", nullable=true)
     */
    private $outsideCostId;

    /**
     * @var string
     *
     * @ORM\Column(name="cost", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $cost;

    /**
     * @var integer
     *
     * @ORM\Column(name="type_id", type="integer", nullable=true)
     */
    private $typeId;



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
     * @return RediEstimateToOutsideCost
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
     * Set outsideCostId
     *
     * @param integer $outsideCostId
     * @return RediEstimateToOutsideCost
     */
    public function setOutsideCostId($outsideCostId)
    {
        $this->outsideCostId = $outsideCostId;

        return $this;
    }

    /**
     * Get outsideCostId
     *
     * @return integer 
     */
    public function getOutsideCostId()
    {
        return $this->outsideCostId;
    }

    /**
     * Set cost
     *
     * @param string $cost
     * @return RediEstimateToOutsideCost
     */
    public function setCost($cost)
    {
        $this->cost = $cost;

        return $this;
    }

    /**
     * Get cost
     *
     * @return string 
     */
    public function getCost()
    {
        return $this->cost;
    }

    /**
     * Set typeId
     *
     * @param integer $typeId
     * @return RediEstimateToOutsideCost
     */
    public function setTypeId($typeId)
    {
        $this->typeId = $typeId;

        return $this;
    }

    /**
     * Get typeId
     *
     * @return integer 
     */
    public function getTypeId()
    {
        return $this->typeId;
    }
}
