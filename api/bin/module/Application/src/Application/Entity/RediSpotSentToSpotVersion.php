<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentToSpotVersion
 *
 * @ORM\Table(name="redi_spot_sent_to_spot_version")
 * @ORM\Entity
 */
class RediSpotSentToSpotVersion
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
     * @ORM\Column(name="spot_sent_id", type="bigint", nullable=true)
     */
    private $spotSentId;

    /**
     * @var integer
     *
     * @ORM\Column(name="spot_id", type="bigint", nullable=true)
     */
    private $spotId;

    /**
     * @var integer
     *
     * @ORM\Column(name="version_id", type="bigint", nullable=true)
     */
    private $versionId;



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
     * Set spotSentId
     *
     * @param integer $spotSentId
     * @return RediSpotSentToSpotVersion
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
     * Set spotId
     *
     * @param integer $spotId
     * @return RediSpotSentToSpotVersion
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
     * @return RediSpotSentToSpotVersion
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
}
