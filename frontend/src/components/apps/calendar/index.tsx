import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { TbCheck } from "react-icons/tb";

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from 'src/lib/supabaseClient';
import { useAuth } from 'src/context/AuthContext';
import { CalendarEvent as DbEventType } from 'src/types/database';
import { HiInformationCircle } from 'react-icons/hi';

import {
  Button,
  Datepicker,
  Label,
  Modal,
  TextInput,
  Spinner,
  Alert,
} from "flowbite-react";
import CardBox from "../../shared/CardBox";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

// Define type for component state and UI usage
type CalendarAppStateEvent = Omit<DbEventType, 'start_time' | 'end_time'> & {
  start: Date | null;
  end: Date | null;
};

const CalendarApp = () => {
  const { user } = useAuth();

  // Use the App state type
  const [calevents, setCalEvents] = React.useState<CalendarAppStateEvent[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState<string>("");
  const [start, setStart] = React.useState<Date | null>(null);
  const [end, setEnd] = React.useState<Date | null>(null);
  const [color, setColor] = React.useState<string>("primary");
  const [update, setUpdate] = React.useState<CalendarAppStateEvent | null>(null);

  // Add state for delete confirmation modal
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = React.useState<CalendarAppStateEvent | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // --- Add Data Fetching Logic ---
  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    // Don't clear modal error on fetch
    // setError(null); 
    try {
      const { data, error: fetchError } = await supabase
        .from('calendar_events')
        // Select actual DB column names
        .select('id, created_at, user_id, title, start_time, end_time, all_day, color')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Map DB data, reading from start_time/end_time
      const mappedEvents = data.map((event: DbEventType) => {
        // Read from correct DB field names
        const startDate = event.start_time ? new Date(event.start_time) : null;
        const endDate = event.end_time ? new Date(event.end_time) : null;

        // Log potential issues
        if (event.start_time && (!startDate || isNaN(startDate.getTime()))) {
            console.warn(`Invalid start_time received for event ID ${event.id}:`, event.start_time);
        }
        if (event.end_time && (!endDate || isNaN(endDate.getTime()))) {
            console.warn(`Invalid end_time received for event ID ${event.id}:`, event.end_time);
        }

        // Return object matching CalendarAppStateEvent (using start/end)
        return {
            id: event.id,
            created_at: event.created_at,
            user_id: event.user_id,
            title: event.title,
            start: startDate, // Assign to state type field 'start'
            end: endDate,   // Assign to state type field 'end'
            all_day: event.all_day ?? false,
            color: event.color ?? 'primary',
        };
      });

      // Filter out events with invalid dates before setting state
      const validEvents: CalendarAppStateEvent[] = mappedEvents.filter(event => 
         event.start instanceof Date && !isNaN(event.start.getTime()) &&
         event.end instanceof Date && !isNaN(event.end.getTime())
      );
      
      if(mappedEvents.length !== validEvents.length) {
          console.warn(`Filtered out ${mappedEvents.length - validEvents.length} events due to invalid dates.`);
      }

      // Set state only with valid events
      setCalEvents(validEvents);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch events';
      toast.error(`Failed to fetch calendar events: ${errorMessage}`);
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Dependency on user

  // Add useEffect hook to call fetchEvents
  useEffect(() => {
    if (user) {
      fetchEvents();
    } else {
      // Clear events if user logs out
      setCalEvents([]);
    }
  }, [user, fetchEvents]);

  const ColorVariation = [
    {
      id: 1,
      eColor: "primary",
      value: "primary",
    },
    {
      id: 2,
      eColor: "success",
      value: "green",
    },
    {
      id: 3,
      eColor: "error",
      value: "red",
    },
    {
      id: 4,
      eColor: "secondary",
      value: "default",
    },
    {
      id: 5,
      eColor: "warning",
      value: "warning",
    },
  ];
  const addNewEventAlert = (slotInfo: { start: Date; end: Date }) => {
    setOpen(true);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);
    setTitle("");
    setColor("primary");
    setUpdate(null);
    setError(null);
  };

  const editEvent = (event: CalendarAppStateEvent) => {
    setOpen(true);
    setUpdate(event);
    setTitle(event.title);
    setStart(event.start);
    setEnd(event.end);
    setColor(event.color ?? "primary");
    setError(null);
  };

  const updateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if update object and necessary fields exist
    if (!update || !update.id || !user || !start || !end) return;

    setError(null);
    const toastId = toast.loading('Updating event...');

    try {
      // Prepare object with DB column names
      const eventDataToUpdate = {
        title: title,
        start_time: start?.toISOString(), // Use DB name
        end_time: end?.toISOString(),     // Use DB name
        color: color,
      };

      const { error: updateError } = await supabase
        .from('calendar_events')
        .update(eventDataToUpdate)
        .eq('id', update.id) // Match the specific event ID
        .eq('user_id', user.id); // Ensure user owns the event

      if (updateError) throw updateError;

      toast.success('Event updated successfully!', { id: toastId });
      fetchEvents(); // Refresh data
      handleClose(); // Close modal

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update event';
      toast.error(`Update failed: ${errorMessage}`, { id: toastId });
      setError(errorMessage); // Show error in modal alert
      console.error("Error updating event:", err);
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const selectinputChangeHandler = (id: string) => setColor(id);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure we have user, dates, and title
    if (!user || !start || !end || !title) return;

    setError(null); // Clear previous modal errors
    const toastId = toast.loading('Adding event...');

    try {
      // Prepare object with DB column names
      const eventDataToInsert = {
        user_id: user.id,
        title: title,
        start_time: start?.toISOString(), // Use DB name
        end_time: end?.toISOString(),     // Use DB name
        color: color,
        all_day: false,
      };

      const { data, error: insertError } = await supabase
        .from('calendar_events')
        .insert([eventDataToInsert])
        .select(); // Optionally get inserted row back

      if (insertError) throw insertError;

      toast.success('Event added successfully!', { id: toastId });
      fetchEvents(); // Refresh the event list from Supabase
      handleClose(); // Close modal

    } catch (err: any) {
       const errorMessage = err.message || 'Failed to add event';
       toast.error(`Add failed: ${errorMessage}`, { id: toastId });
       setError(errorMessage); // Show error in modal alert
       console.error("Error adding event:", err);
     }
  };
  
  // deleteHandler: Remove window.confirm, now triggered by confirmation modal
  const deleteHandler = async (eventConfirmedToDelete: CalendarAppStateEvent | null) => {
    // Check if we have a valid event from the state
    const eventId = eventConfirmedToDelete?.id;
    if (!eventId || !user) {
      console.error("Delete handler called without valid event ID or user.");
      toast.error("Cannot delete event: Missing information.");
      setShowConfirmDeleteModal(false); // Close confirm modal on error
      setEventToDelete(null);
      return;
    }

    // Close confirm modal immediately (or wait for toast)
    setShowConfirmDeleteModal(false);
    const toastId = toast.loading('Deleting event...');
    setError(null); // Clear previous modal errors if any

    try {
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      toast.success('Event deleted successfully!', { id: toastId });
      fetchEvents();
      // Main edit modal (if open) and confirmation modal are already closed or closing
      // handleClose(); // Might reset state too early if main modal wasn't origin

    } catch (err: any) {
       const errorMessage = err.message || 'Failed to delete event';
       toast.error(`Delete failed: ${errorMessage}`, { id: toastId });
       // Don't set modal error here as the confirmation modal is closing
       // setError(errorMessage);
       console.error("Error deleting event:", err);
     } finally {
        setEventToDelete(null); // Clear the event to delete state
     }
  };

  // Function to open the confirmation modal
  const handleDeleteClick = (event: CalendarAppStateEvent | null) => {
    if (!event) return;
    setEventToDelete(event);
    setShowConfirmDeleteModal(true);
    // Optionally close the main edit modal if delete is clicked from there
    // setOpen(false); 
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setStart(null);
    setEnd(null);
    setUpdate(null);
    setError(null);
  };

  const eventColors = (event: CalendarAppStateEvent) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  const handleStartChange = (newValue: any) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue: any) => {
    setEnd(newValue);
  };

  return (
    <>
      <CardBox>
        <Calendar
          selectable
          events={calevents}
          defaultView="month"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          localizer={localizer}
          onSelectEvent={(event: CalendarAppStateEvent) => editEvent(event)}
          onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
          eventPropGetter={(event: any) => eventColors(event)}
          className="min-h-[900px]"
        />
      </CardBox>
      {/* Dialog/Modal */}
      <Modal dismissible show={open} size="lg" onClose={handleClose}>
        <form onSubmit={update ? updateEvent : submitHandler}>
          <Modal.Header>
            {update ? "Update Event" : "Add Event"}

            <p className="text-darklink dark:text-bodytext font-normal mt-3 text-sm">
              {!update
                ? "To add Event kindly fillup the title and choose the event color and press the add button"
                : "To Edit/Update Event kindly change the title and choose the event color and press the update button"}
            </p>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <div className="flex flex-col gap-3">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="event" value="Event Title" />
                </div>
                <TextInput
                  id="event"
                  type="text"
                  sizing="md"
                  value={title}
                  className="form-control"
                  onChange={inputChangeHandler}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="StartDate" value="Start Date" />
                </div>
                <Datepicker
                  value={start}
                  className="form-control calendar static"
                  onChange={handleStartChange}
                />
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="EndDate" value="End Date" />
                </div>
                <Datepicker
                  value={end}
                  className="form-control calendarSec static"
                  onChange={handleEndChange}
                />
              </div>
            </div>

            <h6 className="text-base pt-4">Select Event Color</h6>
            <div className="flex gap-2 items-center mt-2">
              {ColorVariation.map((mcolor) => {
                return (
                  <div
                    className={`h-6 w-6 flex justify-center items-center rounded-full cursor-pointer  bg-${mcolor.eColor}`}
                    key={mcolor.id}
                    onClick={() => selectinputChangeHandler(mcolor.value)}
                  >
                    {mcolor.value === color ? (
                      <TbCheck width="16" className="text-white" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {update && (
              <Button
                type="button"
                color={"error"}
                onClick={() => handleDeleteClick(update)}
              >
                Delete
              </Button>
            )}
            <Button color={"primary"} type="submit" disabled={!title}>
              {update ? "Update Event" : "Add Event"}
            </Button>
            <Button color={"lighterror"} onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmDeleteModal} size="md" onClose={() => setShowConfirmDeleteModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiInformationCircle className="mx-auto mb-4 h-14 w-14 text-red-600 dark:text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the event<br />
              <span className="font-semibold">"{eventToDelete?.title}"</span>?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => deleteHandler(eventToDelete)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => {
                  setShowConfirmDeleteModal(false);
                  setEventToDelete(null); // Clear state on cancel
              }}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CalendarApp;
