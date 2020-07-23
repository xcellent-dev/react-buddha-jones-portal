<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediBillingStatus
 *
 * @ORM\Table(name="redi_billing_status")
 * @ORM\Entity
 */
class RediBillingStatus
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="bill_status", type="string", length=20, nullable=true)
     */
    private $billStatus;



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
     * Set billStatus
     *
     * @param string $billStatus
     * @return RediBillingStatus
     */
    public function setBillStatus($billStatus)
    {
        $this->billStatus = $billStatus;

        return $this;
    }

    /**
     * Get billStatus
     *
     * @return string 
     */
    public function getBillStatus()
    {
        return $this->billStatus;
    }
}
