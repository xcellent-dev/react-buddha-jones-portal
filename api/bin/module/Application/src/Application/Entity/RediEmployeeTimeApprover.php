<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * RediEmployeeTimeApprover
 *
 * @ORM\Table(name="redi_employee_time_approver")
 * @ORM\Entity
 */
class RediEmployeeTimeApprover
{
    /**
     * @var integer
     *
     * @ORM\Column(name="emp_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $empId;

    /**
     * @var integer
     *
     * @ORM\Column(name="approver_employee_id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="NONE")
     */
    private $approverEmployeeId;



    /**
     * Set empId
     *
     * @param integer $empId
     * @return RediEmployeeTimeApprover
     */
    public function setEmpId($empId)
    {
        $this->empId = $empId;

        return $this;
    }

    /**
     * Get empId
     *
     * @return integer 
     */
    public function getEmpId()
    {
        return $this->empId;
    }

    /**
     * Set approverEmployeeId
     *
     * @param integer $approverEmployeeId
     * @return RediEmployeeTimeApprover
     */
    public function setApproverEmployeeId($approverEmployeeId)
    {
        $this->approverEmployeeId = $approverEmployeeId;

        return $this;
    }

    /**
     * Get approverEmployeeId
     *
     * @return integer 
     */
    public function getApproverEmployeeId()
    {
        return $this->approverEmployeeId;
    }
}
