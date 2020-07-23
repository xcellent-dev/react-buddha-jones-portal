<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediSetting
 *
 * @ORM\Table(name="redi_setting", uniqueConstraints={@ORM\UniqueConstraint(name="setting_key_UNIQUE", columns={"setting_key"})})
 * @ORM\Entity
 */
class RediSetting
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
     * @ORM\Column(name="setting_key", type="string", length=100, nullable=true)
     */
    private $settingKey;

    /**
     * @var string
     *
     * @ORM\Column(name="setting_value", type="text", nullable=true)
     */
    private $settingValue;



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
     * Set settingKey
     *
     * @param string $settingKey
     * @return RediSetting
     */
    public function setSettingKey($settingKey)
    {
        $this->settingKey = $settingKey;

        return $this;
    }

    /**
     * Get settingKey
     *
     * @return string 
     */
    public function getSettingKey()
    {
        return $this->settingKey;
    }

    /**
     * Set settingValue
     *
     * @param string $settingValue
     * @return RediSetting
     */
    public function setSettingValue($settingValue)
    {
        $this->settingValue = $settingValue;

        return $this;
    }

    /**
     * Get settingValue
     *
     * @return string 
     */
    public function getSettingValue()
    {
        return $this->settingValue;
    }
}
