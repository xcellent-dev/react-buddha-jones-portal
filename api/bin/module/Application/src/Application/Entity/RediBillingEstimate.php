<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediBillingEstimate
 *
 * @ORM\Table(name="redi_billing_estimate")
 * @ORM\Entity
 */
class RediBillingEstimate
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
     * @ORM\Column(name="estimate_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $estimateId;



    /**
     * Set billId
     *
     * @param integer $billId
     * @return RediBillingEstimate
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
     * Set estimateId
     *
     * @param integer $estimateId
     * @return RediBillingEstimate
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
}
