<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentToCustomerContact
 *
 * @ORM\Table(name="redi_spot_sent_to_customer_contact")
 * @ORM\Entity
 */
class RediSpotSentToCustomerContact
{
    /**
     * @var integer
     *
     * @ORM\Column(name="spot_sent_id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $spotSentId;

    /**
     * @var integer
     *
     * @ORM\Column(name="customer_contact_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $customerContactId;



    /**
     * Set spotSentId
     *
     * @param integer $spotSentId
     * @return RediSpotSentToCustomerContact
     */
    public function setSpotSentId($spotSentId)
    {
        $this->spotSentId = $spotSentId;

        return $this;
    }

    /**
     * Get spotSentId
     *
     * @return integer 
     */
    public function getSpotSentId()
    {
        return $this->spotSentId;
    }

    /**
     * Set customerContactId
     *
     * @param integer $customerContactId
     * @return RediSpotSentToCustomerContact
     */
    public function setCustomerContactId($customerContactId)
    {
        $this->customerContactId = $customerContactId;

        return $this;
    }

    /**
     * Get customerContactId
     *
     * @return integer 
     */
    public function getCustomerContactId()
    {
        return $this->customerContactId;
    }
}
