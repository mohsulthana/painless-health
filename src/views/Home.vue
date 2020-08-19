<template>
  <div class="flex mb-4">
    <div class="w-1/3 h-12 p-3">
      <FullCalendar ref="fullCalendar" :options="calendarOption" />
    </div>
    <div class="w-2/3 p-3 h-12">
      <FullCalendar ref="resourceView" :options="resourceView" />
    </div>

    <div class="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"></div>
        <!-- Add margin if you want to see some of the overlay behind the modal-->
        <div class="modal-content py-4 text-left px-6">
          <!--Title-->
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold">Simple Modal!</p>
            <div class="modal-close cursor-pointer z-50">
              <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>

          <!--Body-->
          <p>Modal content can go here</p>
          <p>...</p>
          <p>...</p>
          <p>...</p>
          <p>...</p>

          <!--Footer-->
          <div class="flex justify-end pt-2">
            <button class="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 hover:text-indigo-400 mr-2">Action</button>
            <button class="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'

export default {
  name: 'Home',
  data () {
    return {
      appointmentModal: false,
      resourceView: {
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        plugins: [interactionPlugin, resourceTimeGridPlugin],
        initialView: 'resourceTimeGridDay',
        dateClick: function (info) {
          this.appointmentModal = true
        },
        select: function (info) {
          alert('selected ' + info.startStr + ' to ' + info.endStr)
        },
        resources: []
      },
      calendarOption: {
        navLinks: true,
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        navLinkDayClick: (date, jsEvent) => {
          const calendarApi = this.$refs.resourceView.getApi()
          calendarApi.gotoDate(date)
        }
      }
    }
  },
  components: {
    FullCalendar
  },
  methods: {
    fetchAppointments () {
      axios.get('http://127.0.0.1:8000/appointments')
        .then((response) => {
          response.data.slice(-5).forEach((value, index) => {
            console.log(value)
            var name = `${value.firstName} ${value.lastName}`
            this.resourceView.resources.push({ title: name })
            this.resourceView.events.push({ start: value.date })
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  mounted () {
    this.fetchAppointments()
  }
}
</script>

<style>
.fc .fc-col-header-cell-cushion {
  display: inline-block;
  padding: 2px 4px;
}
</style>
