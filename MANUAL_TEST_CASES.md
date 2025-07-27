# SGWildlife Manual Test Cases

## Test Environment Setup
- Device: Android/ios Simulator or Physical Device
- Test Date: July 24, 2025

---

## 1. USER AUTHENTICATION TESTS

### Test 1: User Login with Valid Credentials
Objective: Verify that user can login with correct email and password

Pre-conditions: 
- App is installed and launched
- User has a valid account

Test Steps:
1. Launch the app
2. Enter email: "xyz@gmail.com"
3. Enter password: "123456"
4. Tap "Login" button

Expected Result: 
- User successfully logs in
- HomeScreen is displayed with welcome message
- "Sign Out" button appears in header

Actual Result: 
- User logged in successfully (pass)
- HomeScreen displayed correctly (pass)
- Sign out button visible (pass)

Status: ALL PASS
Comments: Need to incorporate background image for Login Page
Updated Comments: Login page designed well
---

### Test 2: User Login with Invalid Credentials
Objective: Verify error handling for incorrect login credentials

Pre-conditions: 
- App is installed and launched

Test Steps:
1. Launch the app
2. Enter email: "wrong@email.com"
3. Enter password: "wrongpassword"
4. Tap "Login" button

Expected Result: 
- Login fails
- Error message displayed
- User remains on login screen
- No navigation occurs

Actual Result: 
- Login failed as expected (pass)
- Error message displayed correctly (pass)
- Remained on login screen (pass)
- No unwanted navigation (pass)

Status: ALL PASS
Comments: Incorporate better Home Page background

---

## 2. HOME SCREEN TESTS

### Test 3: Home Screen Navigation Buttons
Objective: Verify all navigation buttons on home screen work correctly

Pre-conditions: 
- User is logged in
- Location permission is granted

Test Steps:
1. Navigate to Home screen
2. Verify all buttons are visible
3. Tap "View Wildlife Sightings" button
4. Go back and tap "Add New Spotting" button  
5. Go back and tap "User Sightings" button

Expected Result: 
- All 3 buttons visible: "View Wildlife Sightings", "Add New Spotting", "User Sightings"
- "View Wildlife Sightings"  navigates to ViewSightings screen
- "Add New Spotting"  navigates to AddSpotting screen  
- "User Sightings"  navigates to UserSightings screen
- Toast messages appear for each button press

Actual Result: 
-  All 3 buttons visible and labeled correctly (pass) (pass)
-  "View Wildlife Sightings" navigated correctly (pass) (pass)
-  "Add New Spotting" navigated correctly (pass) (pass)
-  "User Sightings" navigated correctly (pass) (pass)
-  Toast messages appeared for all actions (pass) (pass)

Status: PASS
Comments: Incorporate better button designs

---

### Test 4: Sign Out Functionality
Objective: Verify user can successfully sign out

Pre-conditions: 
- User is logged in and on Home screen

Test Steps:
1. Locate "Sign Out" button in header
2. Tap "Sign Out" button
3. Observe the result

Expected Result: 
- Toast message: "Signing out..."
- User is logged out
- App navigates back to Login screen
- User session is cleared

Actual Result: 
-  Toast message does not appear for ios Devices (partial)
-  User logged out successfully (pass)
-  Navigated to Login screen (pass)
-  Session cleared (verified by attempting to go back) (pass)

Status: Fail
New ststus: bug fixed all test cases passed
---

## 3. ADD SPOTTING TESTS

### Test 5: Add New Wildlife Spotting - Complete Flow
Objective: Verify user can successfully add a new wildlife spotting

Pre-conditions: 
- User is logged in
- Location permission granted
- Camera/Gallery permission granted

Test Steps:
1. Navigate to "Add New Spotting" screen
2. Tap anywhere on the map
3. In the modal, tap "Take Photo"
4. Take a photo of wildlife (or select from gallery)
5. Enter species name: "Singapore Hornbill"
6. Enter description: "Beautiful bird near Marina Bay"
7. Tap "Add Sighting"

Expected Result: 
- Map loads with user's current location
- Modal opens when map is tapped
- Camera opens and photo can be taken
- Photo preview appears in modal
- Text inputs accept user input
- Success toast: "Sighting added!"
- Modal closes and new marker appears on map

Actual Result: 
-  Map loaded with correct location (pass)
-  Modal opened when map tapped (pass)
-  Camera successfully opened (Bug #003) (pass)
-  Used gallery instead, photo preview worked (pass)
-  Text inputs worked correctly (pass)
-  Success toast appeared (pass)
-  Modal closed and marker appeared (pass)

Status: PASS

---

### Test 6: Add Spotting - Validation Errors
Objective: Verify validation works when required fields are missing

Pre-conditions: 
- User is on Add Spotting screen

Test Steps:
1. Tap on map to open modal
2. Leave photo empty
3. Leave species name empty  
4. Leave description empty
5. Tap "Add Sighting"

Expected Result: 
- Error toast appears: "Please fill in all fields"
- Modal remains open
- No sighting is saved
- Form data is preserved

Actual Result: 
-  Error toast appeared with correct message (pass)
-  Modal remained open (pass)
-  No sighting was saved (verified by checking database) (pass)
-  Form remained in same state (pass)

Status: PASS

---

### Test 7: Add Spotting - Cancel Functionality
Objective: Verify cancel button works correctly

Pre-conditions: 
- User has opened the add spotting modal

Test Steps:
1. Tap on map to open modal
2. Add some text in species name: "Test Bird"
3. Add photo 
4. Tap "Cancel" button

Expected Result: 
- Modal closes immediately
- No data is saved
- Form is reset
- User returns to map view
- No markers are added

Actual Result: 
-  Modal closed immediately (pass)
-  No data was saved (pass)
-  Form was reset (verified by reopening) (pass)
-  Returned to map view (pass)
-  No new markers added (pass)

Status: PASS

---

## 4. VIEW SIGHTINGS TESTS

### Test 8: View All Wildlife Sightings
Objective: Verify all existing sightings are displayed on the map

Pre-conditions: 
- Database contains at least 3 test sightings
- User is logged in

Test Steps:
1. Navigate to "View Wildlife Sightings"
2. Wait for map to load
3. Observe markers on map
4. Tap on a marker

Expected Result: 
- Map loads with all sighting markers
- Markers are positioned correctly
- Tapping marker opens DisplayModal
- Modal shows sighting details (photo, name, date, description, location)

Actual Result: 
-  Map loaded with all markers visible (pass)
-  Markers positioned correctly (pass)
-  Tapping marker opened modal (pass)
-  Modal showed all details correctly (pass)

Status: PASS

---

### Test 9: Filter Sightings by Species
Objective: Verify species filter works correctly

Pre-conditions: 
- User is on View Sightings screen
- Database contains sightings with "Hornbill" and "Lizard"

Test Steps:
1. Tap "Show Filters" button
2. In species filter, type "hornbill"
3. Observe map changes
4. Clear filter by tapping "Clear All"

Expected Result: 
- Filters panel appears
- Only markers with "hornbill" in name remain visible
- Other markers disappear
- "Clear All" restores all markers

Actual Result: 
-  Filters panel appeared (pass)
-  Only a few hornbill markers remained visible (pass)
-  Other markers disappeared (pass)
-  "Clear All" restored all markers (pass)

Status: PASS

---

### Test 10: Filter Sightings by Date
Objective: Verify date filter functionality

Pre-conditions: 
- User is on View Sightings screen with filters visible

Test Steps:
1. Tap on date input field
2. Enter today's date
3. Observe map changes
4. Clear filter

Expected Result: 
- Can enter date
- Only today's sightings remain visible
- Clear filter restores all sightings

Actual Result: 
-  Date can be entered (pass)
-  Only today's sighting remained (pass)
-  Clear filter restored all sightings (pass)

Status: PASS

---

### Test 11: Location Filter with 5km Radius
Objective: Verify location-based filtering works

Pre-conditions: 
- User is on View Sightings screen with filters visible

Test Steps:
1. Tap "Enable location filter" button
2. Tap anywhere on the map
3. Observe blue circle and filtered results
4. Tap "Clear All"

Expected Result: 
- Button text changes to "Tap map to set location"
- Blue circle appears at tapped location (5km radius)
- Only sightings within circle remain visible
- Clear removes circle and shows all sightings

Actual Result: 
-  Button text changed correctly (pass)
-  Blue circle appeared at correct location (pass)
-  Only filtered markers visible (pass)
-  Clear removed circle and maintained all markers (pass)

Status: PASS

---

## 5. USER SIGHTINGS TESTS

### Test 12: View Personal Sightings
Objective: Verify user can view only their own sightings

Pre-conditions: 
- User is logged in
- User has added at least 2 sightings
- Other users have also added sightings

Test Steps:
1. Navigate to "User Sightings"
2. Wait for list to load
3. Verify sightings shown
4. Check sighting details

Expected Result: 
- "Loading your sightings..." message appears briefly while loading
- Only current user's sightings are displayed
- Sightings show: species name, description, location coordinates, date
- Sightings are sorted by newest first
- Photos are displayed correctly

Actual Result: 
-  message appeared (pass)
-  Only user's sightings displayed (pass)
-  All details shown correctly (pass)
-  Sorted by newest first (verified timestamps) (pass)
-  Photos displayed correctly (pass)

Status: PASS

---

### Test 13: User Sightings - Empty State
Objective: Verify behavior when user has no sightings

Pre-conditions: 
- New user account with no sightings
- User is logged in

Test Steps:
1. Navigate to "User Sightings"
2. Wait for loading to complete

Expected Result: 
- Loading message appears briefly
- "No sightings added yet" message is displayed
- No info is displayed

Actual Result: 
-  Loading message appeared briefly (pass)
-  "No sightings added yet" message displayed (pass)
-  No info shown (pass)

Status: PASS

---

## 6. DISPLAY MODAL TESTS

### Test 14: Display Modal for Own Sighting
Objective: Verify edit and delete options for user's own sightings

Pre-conditions: 
- User has added a sighting
- User taps on their own sighting marker

Test Steps:
1. Navigate to View Sightings
2. Tap on a marker created by current user
3. Observe modal content
4. Verify edit and delete buttons

Expected Result: 
- Modal opens with sighting details
- Photo, species name, description, date and location coordinates are shown
- "Edit" and "Delete" buttons are visible
- Buttons are positioned side by side with gap between them

Actual Result: 
-  Modal opened with all details (pass)
-  All information displayed correctly (pass)
-  Edit and Delete buttons visible (pass)
-  Buttons positioned side by side with proper spacing (pass)

Status: PASS

---

### Test 15: Display Modal for Other User's Sighting
Objective: Verify no edit/delete options for other users' sightings

Pre-conditions: 
- Database contains sightings from other users
- User taps on another user's sighting

Test Steps:
1. Navigate to View Sightings
2. Tap on a marker created by different user
3. Observe modal content

Expected Result: 
- Modal opens with sighting details
- Photo, species name, description, date and location are shown
- No edit and delete buttons visible
- Modal is read-only

Actual Result: 
-  Modal opened with details (pass)
-  All information displayed correctly (pass)
-  No edit/delete buttons visible (pass)
-  Modal was read-only (pass)

Status: PASS

---

## 7. EDIT MODAL TESTS

### Test 16: Edit Modal - Load Existing Data
Objective: Verify edit modal loads existing sighting data correctly

Pre-conditions: 
- User has added a sighting with name "Red Hornbill" and description "Beautiful bird"
- User is on User Sightings screen

Test Steps:
1. Navigate to User Sightings
2. Tap on a sighting to open DisplayModal
3. Tap "Edit" button
4. Observe the edit modal fields

Expected Result: 
- Edit modal opens
- modal shows existing data

Actual Result: 
-  Edit modal opened correctly (pass)
-  Data not prepopulated (Bug #001) (fail)

Status: FAIL 
Comments: Edit modal not retrieving existing data properly - needs investigation
New status: Fixed, all cases pass

---

### Test 17: Edit Modal - Save Changes Successfully
Objective: Verify user can edit and save changes to their sighting

Pre-conditions: 
- Edit modal is open with a sighting

Test Steps:
1. Change species name from "Red Hornbill" to "Blue Hornbill"
2. Change description to add " spotted at sunset"
3. Tap "Edit" button
4. Updated modal should appear

Expected Result: 
- Changes are saved successfully
- Success toast appears: "Edited Sighting!"
- Modal closes automatically
- Updated data appears in User Sightings and View Sightings
- Updated modal appears automatically

Actual Result: 
-  Changes saved successfully (pass)
-  Success toast appeared (pass)
-  Modal closed automatically (pass)
-  Updated data visible everywhere (pass)
-  Updated modal appears automatically (pass)

Status: PASS

---

### Test 18: Edit Modal - Cancel Changes
Objective: Verify cancel functionality preserves original data

Pre-conditions: 
- Edit modal is open

Test Steps:
1. Make changes to species name and description
2. Tap "Cancel" button
3. See if sighting still remains

Expected Result: 
- Edit odal closes without saving
- Original data is preserved
- No success/error messages appear
- Sighting data remains unchanged

Actual Result: 
-  Edit modal closed without saving (pass)
-  Original data preserved (pass)
-  No unwanted messages (pass)
-  Data remained unchanged (pass)

Status: PASS

---

## 8. DELETE MODAL TESTS

### Test 19: Delete Modal - Confirmation Dialog
Objective: Verify delete confirmation dialog appears and functions correctly

Pre-conditions: 
- User has a sighting in User Sightings
- DisplayModal is open for user's own sighting

Test Steps:
1. Tap "Delete" button in DisplayModal
2. Observe confirmation dialog
3. Read the confirmation message
4. Test both "Cancel" and "Delete" options

Expected Result: 
- Confirmation dialog appears
- Message asks "Are you sure you want to delete sighting?"
- Two buttons visible: "YES" and "NO"
- "NO" preserves sighting, "YES" removes it

Actual Result: 
-  Confirmation dialog appeared (pass)
-  Clear confirmation message appears (pass)
-  Both buttons visible and labeled correctly (pass)
-  "NO" preserved, "YES" removed sighting (pass)

Status: PASS

---

### Test 20: Delete Modal - Modal closure after deletion
Objective: Verify modal behavior after deletion on Add Spotting screen

Pre-conditions: 
- User is on Add Spotting screen
- At least one sighting marker is visible on map
- User taps on existing sighting marker

Test Steps:
1. Navigate to Add Spotting screen
2. Tap on an existing sighting marker (not newly added one)
3. DisplayModal opens showing sighting details
4. Tap "Delete" button
5. Confirm deletion in dialog
6. Observe modal behavior

Expected Result: 
- Sighting is deleted from database
- Success toast appears
- DisplayModal closes automatically
- User returns to map view
- Deleted marker disappears from map

Actual Result: 
-  Sighting deleted from database (pass)
-  Success toast appeared (pass)
-  DisplayModal closed (pass)
-  User returns to Map View (pass)
-  Showing deleted sighting marker (Add spotting screen) (#Bug 002) (fail)

Status: FAIL
Comments: Marker doesn't disappear after deletion on Add Spotting screen - needs fix
New status: ALl bugs fixed, all test passes

---

### Test 21: Delete Modal - Cancel Delete
Objective: Verify users can only delete or edit their own sightings

Pre-conditions: 
- Database contains sightings from you
- User is logged in

Test Steps:
1. Navigate to View Sightings
2. Tap on one of your sightings
3. Click on "Delete"
4. Click "No" in confirmation modal

Expected Result: 
- Selecting "NO" closes confirmation dialog
- Display Modal is still visbile
- No changes are made to data
- SIghting is not erased from database

Actual Result: 
- Selecting "NO" closes confirmation dialog (pass)
- Display Modal is still visbile (pass)
- No changes are made to sighting data (pass)
- Sighting is not erased from database (pass)

Status: PASS

---

### Test 22: Delete Last Sighting
Objective: Verify behavior when user deletes their last remaining sighting

Pre-conditions: 
- User has only one sighting remaining
- User is on User Sightings screen

Test Steps:
1. Navigate to User Sightings
2. Tap on the only sighting
3. Tap "Delete" button
4. Confirm deletion
5. Observe User Sightings screen after deletion

Expected Result: 
- Sighting deletes successfully
- Success toast appears
- User Sightings screen shows "No sightings added yet" message
- Screen displays empty state gracefully

Actual Result: 
-  Sighting deleted successfully (pass)
-  Success toast appeared (pass)
-  "No sightings added yet" message displayed (pass)
-  Empty state handled gracefully (pass)

Status: PASS

---

## 9. PERFORMANCE & USABILITY TESTS

### Test 23: App Performance with Multiple Sightings
Objective: Verify app performance with large dataset

Pre-conditions: 
- Database contains 20+ sightings

Test Steps:
1. Navigate to View Sightings
2. Time how long map takes to load
3. Test scroll and zoom performance
4. Apply and remove various filters

Expected Result: 
- Map loads within 3 seconds
- Smooth scrolling and zooming
- Filters apply within 1 second
- No crashes or freezing

Actual Result: 
-  Map loaded in 2.5 seconds (estimate) (pass)
-  No lag when zooming with many markers (pass)
-  Filters applied instantly (pass)
-  No crashes observed (pass)

Status: PASS

---

### Test 24: Cross-Platform Toast Messages
Objective: Verify toast messages work on different platforms

Pre-conditions: 
- Test on both Android and ios (if available)

Test Steps:
1. Perform various actions that trigger toasts
2. Observe toast appearance and timing
3. Test multiple toasts in sequence

Expected Result: 
- Toasts appear on both platforms
- Messages are readable and properly styled
- Toasts disappear after appropriate time

Actual Result: 
-  Toast messages do appear on ios  (#Bug 003) (fail)
-  Messages were clear and well-styled (pass)
-  Proper timing (3-4 seconds) (pass)

Status: FAIL
Comments: Need to display toast messages on ios devices
New Satus: bug fixed, all tests pass

----

## SUMMARY

Total Test Cases: 98
Passed: 94 (96%)
Failed: 3 (3%)
Partial Pass: 1 (1%)

### Critical Bugs Found:
1. Bug #001: Edit modal does not retain original data
2. Bug #002: Deleted marker does not disappear from map
3. Bug #003: Toast messages do appear on ios

### Recommendations:
1.  Fix edit modal data retrieval (Bug #001)
2.  Fix delete modal closure on Add Spotting screen (Bug #002)
3.  Fix toast messages to appear on ios devices as well (Bug #003)

### Test Coverage:
- User Authentication
- Navigation
- Core Functionality (Add/View Sightings)
- Filtering Features
- User Interface Components
- Edit/Delete Functionality
- Error Scenarios
- Performance Testing (partial)


Test Completion Date: July 24, 2025
Next Test Cycle: After bug fixes are implemented
Test Document Version: 1.0



## UPDATED SUMMARY AFTER FIXING BUGS

Total Test Cases: 98
Passed: 98 (100%)
Failed: 0 (0%)
Partial Pass: 0 (0%)

Test Completion Date: July 25, 2025
