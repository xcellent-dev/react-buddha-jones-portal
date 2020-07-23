<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEditorToSpot
 *
 * @ORM\Table(name="redi_editor_to_spot")
 * @ORM\Entity
 */
class RediEditorToSpot
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
     * @ORM\Column(name="editor_id", type="integer", nullable=true)
     */
    private $editorId;

    /**
     * @var integer
     *
     * @ORM\Column(name="spot_id", type="integer", nullable=true)
     */
    private $spotId;



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
     * Set editorId
     *
     * @param integer $editorId
     * @return RediEditorToSpot
     */
    public function setEditorId($editorId)
    {
        $this->editorId = $editorId;

        return $this;
    }

    /**
     * Get editorId
     *
     * @return integer 
     */
    public function getEditorId()
    {
        return $this->editorId;
    }

    /**
     * Set spotId
     *
     * @param integer $spotId
     * @return RediEditorToSpot
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
}
