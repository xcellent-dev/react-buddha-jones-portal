<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediBillingApproval
 *
 * @ORM\Table(name="redi_billing_approval")
 * @ORM\Entity
 */
class RediBillingApproval
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
     * @ORM\Column(name="user_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $userId;

    /**
     * @var integer
     *
     * @ORM\Column(name="approved", type="smallint", nullable=true)
     */
    private $approved;



    /**
     * Set billId
     *
     * @param integer $billId
     * @return RediBillingApproval
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
     * Set userId
     *
     * @param integer $userId
     * @return RediBillingApproval
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
     * Set approved
     *
     * @param integer $approved
     * @return RediBillingApproval
     */
    public function setApproved($approved)
    {
        $this->approved = $approved;

        return $this;
    }

    /**
     * Get approved
     *
     * @return integer 
     */
    public function getApproved()
    {
        return $this->approved;
    }
}
