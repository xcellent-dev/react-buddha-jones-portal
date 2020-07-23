<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentToWorkStage
 *
 * @ORM\Table(name="redi_spot_sent_to_work_stage")
 * @ORM\Entity
 */
class RediSpotSentToWorkStage
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
     * @ORM\Column(name="work_stage_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $workStageId;



    /**
     * Set spotSentId
     *
     * @param integer $spotSentId
     * @return RediSpotSentToWorkStage
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
     * Set workStageId
     *
     * @param integer $workStageId
     * @return RediSpotSentToWorkStage
     */
    public function setWorkStageId($workStageId)
    {
        $this->workStageId = $workStageId;

        return $this;
    }

    /**
     * Get workStageId
     *
     * @return integer 
     */
    public function getWorkStageId()
    {
        return $this->workStageId;
    }
}
