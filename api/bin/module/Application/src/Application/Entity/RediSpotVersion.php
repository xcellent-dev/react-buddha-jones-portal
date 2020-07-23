<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotVersion
 *
 * @ORM\Table(name="redi_spot_version")
 * @ORM\Entity
 */
class RediSpotVersion
{
    /**
     * @var integer
     *
     * @ORM\Column(name="spot_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $spotId;

    /**
     * @var integer
     *
     * @ORM\Column(name="version_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $versionId;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_type", type="string", length=10, nullable=true)
     */
    private $billingType;



    /**
     * Set spotId
     *
     * @param integer $spotId
     * @return RediSpotVersion
     */
    public function setSpotId($spotId)
    {
        $this->spotId = $spotId;

        return $this;
    }

    /**
     * Get spotId
     *
     * @return integer 
     */
    public function getSpotId()
    {
        return $this->spotId;
    }

    /**
     * Set versionId
     *
     * @param integer $versionId
     * @return RediSpotVersion
     */
    public function setVersionId($versionId)
    {
        $this->versionId = $versionId;

        return $this;
    }

    /**
     * Get versionId
     *
     * @return integer 
     */
    public function getVersionId()
    {
        return $this->versionId;
    }

    /**
     * Set billingType
     *
     * @param string $billingType
     * @return RediSpotVersion
     */
    public function setBillingType($billingType)
    {
        $this->billingType = $billingType;

        return $this;
    }

    /**
     * Get billingType
     *
     * @return string 
     */
    public function getBillingType()
    {
        return $this->billingType;
    }
}
