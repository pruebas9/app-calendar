<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use AppBundle\Entity\Eventos;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {        
        return $this->render('AppBundle:layouts:layout.html.twig', [
            
        ]);
    }
    
    /**
     * @Route("/eventos", name="eventos")
     */
    public function getEventsAction(Request $request)
    {
        $entityManager = $this->getDoctrine()->getManager();
        $events = $entityManager->getRepository('AppBundle:Eventos')->getEvents();        
         
        return new JsonResponse($events);
       
    }
    
    
    /**
     * @Route("/events", name="events")
     */
    public function eventsAction(Request $request)
    {
        
        // Controla acción (Crear, modificar, borrar)
        $action = ($request->query->get('action') !== null)? $request->query->get('action') : 'read';     
        
        $title = ($request->request->get('title') !== null)? $request->request->get('title') : null;
        $description = ($request->request->get('description') !== null)? $request->request->get('description') : null;
        $color = ($request->request->get('color') !== null)? $request->request->get('color') : null;
        $textColor = ($request->request->get('textColor') !== null)? $request->request->get('textColor') : null;
        $start = ($request->request->get('start') !== null)? $request->request->get('start') : null;
        $end = ($request->request->get('end') !== null)? $request->request->get('end') : null;
        

        $entityManager = $this->getDoctrine()->getManager();
        
        switch($action){
            case 'create':                
                $event = new Eventos();
        
                $event->setTitle($title);
                $event->setDescription($description);
                $event->setColor($color);
                $event->setTextColor($textColor);
                $event->setStart(new \DateTime($start));
                $event->setEnd(new \DateTime($end));
                               
                $entityManager->persist($event);
                $entityManager->flush();
                
                break;

            case 'edit':
                
                if($request->request->get('id') !== null){
                    $event_id = $request->request->get('id');
                    $event = $entityManager->getRepository('AppBundle:Eventos')->find($event_id);
                    
                    $event->setTitle($title);
                    $event->setDescription($description);
                    $event->setColor($color);
                    $event->setTextColor($textColor);
                    $event->setStart(new \DateTime($start));
                    $event->setEnd(new \DateTime($end));

                    $entityManager->flush();
                }
                
                break;

            case 'delete':
              
                if($request->request->get('id') !== null){
                    $event_id = $request->request->get('id');
                    $event = $entityManager->getRepository('AppBundle:Eventos')->find($event_id);
                    $entityManager->remove($event);
                    $entityManager->flush();
                }
                
                break;

            default:
                // Get events
                $entityManager = $this->getDoctrine()->getManager();
                $events = $entityManager->getRepository('AppBundle:Eventos')->getEvents();

                return new JsonResponse($events);
                
        }
               
        return $this->render('AppBundle:layouts:layout.html.twig');
    }
}
