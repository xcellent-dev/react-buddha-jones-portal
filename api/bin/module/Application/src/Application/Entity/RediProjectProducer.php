<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectProducer
 *
 * @ORM\Table(name="redi_project_producer")
 * @ORM\Entity
 */
class RediProjectProducer
{
    /**
     * @var integer
     *
     * @ORM\Column(name="project_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $projectId;

    /**
     * @var integer
     *
     * @ORM\Column(name="producer_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $producerId;



    /**
     * Set projectId
     *
     * @param integer $projectId
     * @return RediProjectProducer
     */
    public function setProjectId($projectId)
    {
        $this->projectId = $projectId;

        return $this;
    }

    /**
     * Get projectId
     *
     * @return integer 
     */
    public function getProjectId()
    {
        return $this->projectId;
    }

    /**
     * Set producerId
     *
     * @param integer $producerId
     * @return RediProjectProducer
     */
    public function setProducerId($producerId)
    {
        $this->producerId = $producerId;

        return $this;
    }

    /**
     * Get producerId
     *
     * @return integer 
     */
    public function getProducerId()
    {
        return $this->producerId;
    }
}
