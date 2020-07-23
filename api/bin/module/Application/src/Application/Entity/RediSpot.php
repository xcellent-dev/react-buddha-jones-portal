<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpot
 *
 * @ORM\Table(name="redi_spot")
 * @ORM\Entity
 */
class RediSpot
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
     * @var string
     *
     * @ORM\Column(name="spot_name", type="string", length=22, nullable=true)
     */
    private $spotName;

    /**
     * @var integer
     *
     * @ORM\Column(name="project_id", type="integer", nullable=true)
     */
    private $projectId;

    /**
     * @var integer
     *
     * @ORM\Column(name="campaign_id", type="integer", nullable=true)
     */
    private $campaignId;

    /**
     * @var integer
     *
     * @ORM\Column(name="revision_not_counted", type="smallint", nullable=true)
     */
    private $revisionNotCounted;

    /**
     * @var string
     *
     * @ORM\Column(name="notes", type="text", nullable=true)
     */
    private $notes;

    /**
     * @var integer
     *
     * @ORM\Column(name="revisions", type="integer", nullable=true)
     */
    private $revisions;

    /**
     * @var integer
     *
     * @ORM\Column(name="graphics_revisions", type="smallint", nullable=true)
     */
    private $graphicsRevisions;

    /**
     * @var string
     *
     * @ORM\Column(name="first_revision_cost", type="decimal", precision=19, scale=2, nullable=true)
     */
    private $firstRevisionCost;



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
     * Set spotName
     *
     * @param string $spotName
     * @return RediSpot
     */
    public function setSpotName($spotName)
    {
        $this->spotName = $spotName;

        return $this;
    }

    /**
     * Get spotName
     *
     * @return string 
     */
    public function getSpotName()
    {
        return $this->spotName;
    }

    /**
     * Set projectId
     *
     * @param integer $projectId
     * @return RediSpot
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
     * Set campaignId
     *
     * @param integer $campaignId
     * @return RediSpot
     */
    public function setCampaignId($campaignId)
    {
        $this->campaignId = $campaignId;

        return $this;
    }

    /**
     * Get campaignId
     *
     * @return integer 
     */
    public function getCampaignId()
    {
        return $this->campaignId;
    }

    /**
     * Set revisionNotCounted
     *
     * @param integer $revisionNotCounted
     * @return RediSpot
     */
    public function setRevisionNotCounted($revisionNotCounted)
    {
        $this->revisionNotCounted = $revisionNotCounted;

        return $this;
    }

    /**
     * Get revisionNotCounted
     *
     * @return integer 
     */
    public function getRevisionNotCounted()
    {
        return $this->revisionNotCounted;
    }

    /**
     * Set notes
     *
     * @param string $notes
     * @return RediSpot
     */
    public function setNotes($notes)
    {
        $this->notes = $notes;

        return $this;
    }

    /**
     * Get notes
     *
     * @return string 
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Set revisions
     *
     * @param integer $revisions
     * @return RediSpot
     */
    public function setRevisions($revisions)
    {
        $this->revisions = $revisions;

        return $this;
    }

    /**
     * Get revisions
     *
     * @return integer 
     */
    public function getRevisions()
    {
        return $this->revisions;
    }

    /**
     * Set graphicsRevisions
     *
     * @param integer $graphicsRevisions
     * @return RediSpot
     */
    public function setGraphicsRevisions($graphicsRevisions)
    {
        $this->graphicsRevisions = $graphicsRevisions;

        return $this;
    }

    /**
     * Get graphicsRevisions
     *
     * @return integer 
     */
    public function getGraphicsRevisions()
    {
        return $this->graphicsRevisions;
    }

    /**
     * Set firstRevisionCost
     *
     * @param string $firstRevisionCost
     * @return RediSpot
     */
    public function setFirstRevisionCost($firstRevisionCost)
    {
        $this->firstRevisionCost = $firstRevisionCost;

        return $this;
    }

    /**
     * Get firstRevisionCost
     *
     * @return string 
     */
    public function getFirstRevisionCost()
    {
        return $this->firstRevisionCost;
    }
}
