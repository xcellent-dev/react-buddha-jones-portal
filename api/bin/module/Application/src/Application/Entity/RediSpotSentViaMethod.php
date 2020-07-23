<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentViaMethod
 *
 * @ORM\Table(name="redi_spot_sent_via_method")
 * @ORM\Entity
 */
class RediSpotSentViaMethod
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
     * @ORM\Column(name="name", type="string", length=45, nullable=true)
     */
    private $name;

    /**
     * @var integer
     *
     * @ORM\Column(name="parent_id", type="integer", nullable=true)
     */
    private $parentId;

    /**
     * @var integer
     *
     * @ORM\Column(name="work_type_id", type="integer", nullable=true)
     */
    private $workTypeId;



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
     * Set name
     *
     * @param string $name
     * @return RediSpotSentViaMethod
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set parentId
     *
     * @param integer $parentId
     * @return RediSpotSentViaMethod
     */
    public function setParentId($parentId)
    {
        $this->parentId = $parentId;

        return $this;
    }

    /**
     * Get parentId
     *
     * @return integer 
     */
    public function getParentId()
    {
        return $this->parentId;
    }

    /**
     * Set workTypeId
     *
     * @param integer $workTypeId
     * @return RediSpotSentViaMethod
     */
    public function setWorkTypeId($workTypeId)
    {
        $this->workTypeId = $workTypeId;

        return $this;
    }

    /**
     * Get workTypeId
     *
     * @return integer 
     */
    public function getWorkTypeId()
    {
        return $this->workTypeId;
    }
}
