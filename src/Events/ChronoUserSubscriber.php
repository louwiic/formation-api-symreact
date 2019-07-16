<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use App\Entity\Utilisateur;

/**
 * Undocumented class
 */
class ChronoUserSubscriber implements EventSubscriberInterface{

    private $security;
    private $repository;
    
    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository= $repository;
    }

 
    public static function getSubscribedEvents()
    {
        return[
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(GetResponseForControllerResultEvent $event){

       // dd($this->security->getUser());

        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($invoice instanceof Invoice && $method === "POST"){
        
        $nextChrono = $this->repository->findNextChrono($this->security->getUser()); //dernier chrono ajouté en bdd
        $invoice->setChrono($nextChrono);
        
            //TODO: A déplacer dans une classe dédiée
            if(empty($invoice->getSentAt())){
                $invoice->setSentAt(new \DateTime());
            }
        }
    }
}