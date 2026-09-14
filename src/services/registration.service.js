const Registration = require('../models/Registration'); 
const Event = require('../models/Event'); 
const createRegistration = 
    async ({ userId, eventId }) => {
         const event = await Event.findById(eventId); 
         if (!event) { 
            const error = new Error( 'Event not found' ); 
            error.status = 404; throw error; 
        }
        if ( event.status !== 'published' ) { 
            const error = new Error( 'Registration is not available for this event' ); 
            error.status = 400; 
            throw error; 
        }  
        const existingRegistration = await Registration.findOne({ user: userId, event: eventId }); 
        if (existingRegistration) { 
            const error = new Error( 'You are already registered for this event' ); 
            error.status = 409; 
            throw error; 
        } 
        if (event.capacity > 0) { 
            const registrationCount = await Registration.countDocuments({ event: eventId, status: 'registered' }); 
            if ( registrationCount >= event.capacity ) { 
                const error = new Error( 'Event is fully booked' ); 
                error.status = 400; 
                throw error; 
            } 
        } 
        const registration = await Registration.create({ user: userId, event: eventId }); 
        return Registration
            .findById( registration._id )
            .populate( 'event' )
            .populate( 'user', 'name email phone' );
    };
const getMyRegistrations = async (userId) => {
     return Registration 
     .find({ user: userId }) 
     .populate('event') 
     .sort({ createdAt: -1 }); 
};
const getEventRegistrations = async (eventId) => { 
    return Registration .find({ event: eventId }) 
    .populate( 'user', 'name email phone' ) 
    .sort({ createdAt: -1 }); 
}; 
const cancelRegistration = async ({ 
    registrationId, userId }) => { 
        const registration = await Registration.findById( registrationId ); 
        if (!registration) { 
            const error = new Error( 'Registration not found' ); 
            error.status = 404; 
            throw error; 
        } 
        if ( registration.user.toString() !== userId.toString() ) { 
            const error = new Error( 'You can only cancel your own registration' ); 
            error.status = 403; 
            throw error; 
        } 
        registration.status = 'cancelled'; 
        await registration.save(); 
        return registration; 
}; 

module.exports = { createRegistration, getMyRegistrations, getEventRegistrations, cancelRegistration };