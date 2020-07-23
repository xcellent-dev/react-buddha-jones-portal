<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediProjectManager
 *
 * @ORM\Table(name="redi_project_manager")
 * @ORM\Entity
 */
class RediProjectManager
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
     * @ORM\Column(name="manager_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $managerId;



    /**
     * Set projectId
     *
     * @param integer $projectId
     * @return RediProjectManager
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
     * Set managerId
     *
     * @param integer $managerId
     * @return RediProjectManager
     */
    public function setManagerId($managerId)
    {
        $this->managerId = $managerId;

        return $this;
    }

    /**
     * Get managerId
     *
     * @return integer 
     */
    public function getManagerId()
    {
        return $this->managerId;
    }
}
