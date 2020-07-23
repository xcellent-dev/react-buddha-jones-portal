<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediWorkStage
 *
 * @ORM\Table(name="redi_work_stage")
 * @ORM\Entity
 */
class RediWorkStage
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
     * @ORM\Column(name="work_stage", type="string", length=100, nullable=true)
     */
    private $workStage;

    /**
     * @var integer
     *
     * @ORM\Column(name="parent_id", type="integer", nullable=true)
     */
    private $parentId;



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
     * Set workStage
     *
     * @param string $workStage
     * @return RediWorkStage
     */
    public function setWorkStage($workStage)
    {
        $this->workStage = $workStage;

        return $this;
    }

    /**
     * Get workStage
     *
     * @return string 
     */
    public function getWorkStage()
    {
        return $this->workStage;
    }

    /**
     * Set parentId
     *
     * @param integer $parentId
     * @return RediWorkStage
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
}
