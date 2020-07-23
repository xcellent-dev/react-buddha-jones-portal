<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSpotSentToSpotVersionToEditorDesigner
 *
 * @ORM\Table(name="redi_spot_sent_to_spot_version_to_editor_designer")
 * @ORM\Entity
 */
class RediSpotSentToSpotVersionToEditorDesigner
{
    /**
     * @var integer
     *
     * @ORM\Column(name="spot_sent_spot_version_id", type="bigint", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $spotSentSpotVersionId;

    /**
     * @var integer
     *
     * @ORM\Column(name="editor_designer_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $editorDesignerId;



    /**
     * Set spotSentSpotVersionId
     *
     * @param integer $spotSentSpotVersionId
     * @return RediSpotSentToSpotVersionToEditorDesigner
     */
    public function setSpotSentSpotVersionId($spotSentSpotVersionId)
    {
        $this->spotSentSpotVersionId = $spotSentSpotVersionId;

        return $this;
    }

    /**
     * Get spotSentSpotVersionId
     *
     * @return integer 
     */
    public function getSpotSentSpotVersionId()
    {
        return $this->spotSentSpotVersionId;
    }

    /**
     * Set editorDesignerId
     *
     * @param integer $editorDesignerId
     * @return RediSpotSentToSpotVersionToEditorDesigner
     */
    public function setEditorDesignerId($editorDesignerId)
    {
        $this->editorDesignerId = $editorDesignerId;

        return $this;
    }

    /**
     * Get editorDesignerId
     *
     * @return integer 
     */
    public function getEditorDesignerId()
    {
        return $this->editorDesignerId;
    }
}
