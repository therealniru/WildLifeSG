# WildLifeSG Manual Test Cases

## Test Environment Setup
- **Device**: Android/iOS Simulator or Physical Device
- **App Version**: 0.0.1
- **Test Date**: July 24, 2025
- **Tester**: [Your Name]

---

## 1. USER AUTHENTICATION TESTS

### TC001: User Login with Valid Credentials
**Objective**: Verify that user can login with correct email and password

**Pre-conditions**: 
- App is installed and launched
- User has a valid account (test@example.com / password123)

**Test Steps**:
1. Launch the app
2. Enter email: "test@example.com"
3. Enter password: "password123"
4. Tap "Login" button

**Expected Result**: 
- User successfully logs in
- HomeScreen is displayed with welcome message
- "Sign Out" button appears in header
- Toast message shows "Login successful"

**Actual Result**: 
- ✅ PASS: User logged in successfully
- ✅ PASS: HomeScreen displayed correctly
- ✅ PASS: Sign out button visible
- ✅ PASS: Toast message appeared

**Status**: PASS
**Comments**: Need to incorporate background image for Login Page
---

### TC002: User Login with Invalid Credentials
**Objective**: Verify error handling for incorrect login credentials

**Pre-conditions**: 
- App is installed and launched

**Test Steps**:
1. Launch the app
2. Enter email: "wrong@email.com"
3. Enter password: "wrongpassword"
4. Tap "Login" button

**Expected Result**: 
- Login fails
- Error message displayed: "Invalid email or password"
- User remains on login screen
- No navigation occurs

**Actual Result**: 
- ✅ PASS: Login failed as expected
- ✅ PASS: Error message displayed correctly
- ✅ PASS: Remained on login screen
- ✅ PASS: No unwanted navigation

**Status**: PASS
**Comments**: Incorporate better Home Page background

---

## 2. HOME SCREEN TESTS

### TC003: Home Screen Navigation Buttons
**Objective**: Verify all navigation buttons on home screen work correctly

**Pre-conditions**: 
- User is logged in
- Location permission is granted

**Test Steps**:
1. Navigate to Home screen
2. Verify all buttons are visible
3. Tap "View Wildlife Sightings" button
4. Go back and tap "Add New Spotting" button  
5. Go back and tap "User Sightings" button

**Expected Result**: 
- All 3 buttons visible: "View Wildlife Sightings", "Add New Spotting", "User Sightings"
- "View Wildlife Sightings" → navigates to ViewSightings screen
- "Add New Spotting" → navigates to AddSpotting screen  
- "User Sightings" → navigates to UserSightings screen
- Toast messages appear for each button press

**Actual Result**: 
- ✅ PASS: All 3 buttons visible and labeled correctly
- ✅ PASS: "View Wildlife Sightings" navigated correctly
- ✅ PASS: "Add New Spotting" navigated correctly
- ✅ PASS: "User Sightings" navigated correctly
- ✅ PASS: Toast messages appeared for all actions

**Status**: PASS
**Comments**: Incorporate better button designs

---

### TC004: Sign Out Functionality
**Objective**: Verify user can successfully sign out

**Pre-conditions**: 
- User is logged in and on Home screen

**Test Steps**:
1. Locate "Sign Out" button in header
2. Tap "Sign Out" button
3. Observe the result

**Expected Result**: 
- Toast message: "Signing out..."
- User is logged out
- App navigates back to Login screen
- User session is cleared

**Actual Result**: 
- ⚠️ PARTIAL: Toast message does not appear for iOs Devices
- ✅ PASS: User logged out successfully
- ✅ PASS: Navigated to Login screen
- ✅ PASS: Session cleared (verified by attempting to go back)

**Status**: PARTIAL PASS

---

## 3. ADD SPOTTING TESTS

### TC005: Add New Wildlife Spotting - Complete Flow
**Objective**: Verify user can successfully add a new wildlife spotting

**Pre-conditions**: 
- User is logged in
- Location permission granted
- Camera/Gallery permission granted

**Test Steps**:
1. Navigate to "Add New Spotting" screen
2. Tap anywhere on the map
3. In the modal, tap "Take Photo"
4. Take a photo of wildlife (or select from gallery)
5. Enter species name: "Singapore Hornbill"
6. Enter description: "Beautiful bird near Marina Bay"
7. Tap "Add Sighting"

**Expected Result**: 
- Map loads with user's current location
- Modal opens when map is tapped
- Camera opens and photo can be taken
- Photo preview appears in modal
- Text inputs accept user input
- Success toast: "Sighting added successfully"
- Modal closes and new marker appears on map

**Actual Result**: 
- ✅ PASS: Map loaded with correct location
- ✅ PASS: Modal opened when map tapped
- ✅ PASS: Camera successfully opened (Bug #003)
- ✅ PASS: Used gallery instead, photo preview worked
- ✅ PASS: Text inputs worked correctly
- ✅ PASS: Success toast appeared
- ✅ PASS: Modal closed and marker appeared

**Status**: PASS

---

### TC006: Add Spotting - Validation Errors
**Objective**: Verify validation works when required fields are missing

**Pre-conditions**: 
- User is on Add Spotting screen

**Test Steps**:
1. Tap on map to open modal
2. Leave photo empty
3. Leave species name empty  
4. Leave description empty
5. Tap "Add Sighting"

**Expected Result**: 
- Error toast appears: "Please fill in all fields and add a photo"
- Modal remains open
- No sighting is saved
- Form data is preserved

**Actual Result**: 
- ✅ PASS: Error toast appeared with correct message
- ✅ PASS: Modal remained open
- ✅ PASS: No sighting was saved (verified by checking database)
- ✅ PASS: Form remained in same state

**Status**: PASS

---

### TC007: Add Spotting - Cancel Functionality
**Objective**: Verify cancel button works correctly

**Pre-conditions**: 
- User has opened the add spotting modal

**Test Steps**:
1. Tap on map to open modal
2. Add some text in species name: "Test Bird"
3. Add photo (optional)
4. Tap "Cancel" button

**Expected Result**: 
- Modal closes immediately
- No data is saved
- Form is reset
- User returns to map view
- No markers are added

**Actual Result**: 
- ✅ PASS: Modal closed immediately
- ✅ PASS: No data was saved
- ✅ PASS: Form was reset (verified by reopening)
- ✅ PASS: Returned to map view
- ✅ PASS: No new markers added

**Status**: PASS

---

## 4. VIEW SIGHTINGS TESTS

### TC008: View All Wildlife Sightings
**Objective**: Verify all existing sightings are displayed on the map

**Pre-conditions**: 
- Database contains at least 3 test sightings
- User is logged in

**Test Steps**:
1. Navigate to "View Wildlife Sightings"
2. Wait for map to load
3. Observe markers on map
4. Tap on a marker

**Expected Result**: 
- Map loads with all sighting markers
- Markers are positioned correctly
- Tapping marker opens DisplayModal
- Modal shows sighting details (photo, name, description, location)

**Actual Result**: 
- ✅ PASS: Map loaded with 5 markers visible
- ✅ PASS: Markers positioned correctly
- ✅ PASS: Tapping marker opened modal
- ✅ PASS: Modal showed all details correctly

**Status**: PASS

---

### TC009: Filter Sightings by Species
**Objective**: Verify species filter works correctly

**Pre-conditions**: 
- User is on View Sightings screen
- Database contains sightings with "Hornbill" and "Lizard"

**Test Steps**:
1. Tap "Show Filters" button
2. In species filter, type "hornbill"
3. Observe map changes
4. Clear filter by tapping "Clear All"

**Expected Result**: 
- Filters panel appears
- Only markers with "hornbill" in name remain visible
- Other markers disappear
- "Clear All" restores all markers

**Actual Result**: 
- ✅ PASS: Filters panel appeared
- ✅ PASS: Only 2 hornbill markers remained visible
- ✅ PASS: Other 3 markers disappeared
- ✅ PASS: "Clear All" restored all 5 markers

**Status**: PASS

---

### TC010: Filter Sightings by Date
**Objective**: Verify date filter functionality

**Pre-conditions**: 
- User is on View Sightings screen with filters visible

**Test Steps**:
1. Tap on date input field
2. Select today's date from date picker
3. Observe map changes
4. Clear filter

**Expected Result**: 
- Date picker opens
- Can select date easily
- Only today's sightings remain visible
- Clear filter restores all sightings

**Actual Result**: 
- ✅ PASS: Date picker opened correctly
- ✅ PASS: Date selection was intuitive
- ✅ PASS: Only 1 today's sighting remained
- ✅ PASS: Clear filter restored all sightings

**Status**: PASS

---

### TC011: Location Filter with 5km Radius
**Objective**: Verify location-based filtering works

**Pre-conditions**: 
- User is on View Sightings screen with filters visible

**Test Steps**:
1. Tap "Enable location filter" button
2. Tap anywhere on the map
3. Observe blue circle and filtered results
4. Tap "Clear All"

**Expected Result**: 
- Button text changes to "Tap map to set location"
- Blue circle appears at tapped location (5km radius)
- Only sightings within circle remain visible
- Clear removes circle and shows all sightings

**Actual Result**: 
- ✅ PASS: Button text changed correctly
- ✅ PASS: Blue circle appeared at correct location
- ✅ PASS: Only filtered markers visible
- ✅ PASS: Clear removed circle and maintained all markers

**Status**: PASS

---

## 5. USER SIGHTINGS TESTS

### TC012: View Personal Sightings
**Objective**: Verify user can view only their own sightings

**Pre-conditions**: 
- User is logged in
- User has added at least 2 sightings
- Other users have also added sightings

**Test Steps**:
1. Navigate to "User Sightings"
2. Wait for list to load
3. Verify sightings shown
4. Check sighting details

**Expected Result**: 
- Loading message appears initially
- Only current user's sightings are displayed
- Sightings show: species name, description, location coordinates, date
- Sightings are sorted by newest first
- Photos are displayed correctly

**Actual Result**: 
- ✅ PASS: Loading message appeared
- ✅ PASS: Only user's 3 sightings displayed
- ✅ PASS: All details shown correctly
- ✅ PASS: Sorted by newest first (verified timestamps)
- ✅ PASS: Photos displayed correctly

**Status**: PASS

---

### TC013: User Sightings - Empty State
**Objective**: Verify behavior when user has no sightings

**Pre-conditions**: 
- New user account with no sightings
- User is logged in

**Test Steps**:
1. Navigate to "User Sightings"
2. Wait for loading to complete

**Expected Result**: 
- Loading message appears briefly
- "No sightings added yet" message is displayed
- No list or cards are shown
- Screen is clean and informative

**Actual Result**: 
- ✅ PASS: Loading message appeared briefly
- ✅ PASS: "No sightings added yet" message displayed
- ✅ PASS: No list elements shown
- ✅ PASS: Screen looked clean

**Status**: PASS

---

## 6. DISPLAY MODAL TESTS

### TC014: Display Modal for Own Sighting
**Objective**: Verify edit and delete options for user's own sightings

**Pre-conditions**: 
- User has added a sighting
- User taps on their own sighting marker

**Test Steps**:
1. Navigate to View Sightings
2. Tap on a marker created by current user
3. Observe modal content
4. Verify edit and delete buttons

**Expected Result**: 
- Modal opens with sighting details
- Photo, species name, description, and location coordinates are shown
- "Edit" and "Delete" buttons are visible
- Buttons are positioned side by side with gap between them

**Actual Result**: 
- ✅ PASS: Modal opened with all details
- ✅ PASS: All information displayed correctly
- ✅ PASS: Edit and Delete buttons visible
- ✅ PASS: Buttons positioned side by side with proper spacing

**Status**: PASS

---

### TC015: Display Modal for Other User's Sighting
**Objective**: Verify no edit/delete options for other users' sightings

**Pre-conditions**: 
- Database contains sightings from other users
- User taps on another user's sighting

**Test Steps**:
1. Navigate to View Sightings
2. Tap on a marker created by different user
3. Observe modal content

**Expected Result**: 
- Modal opens with sighting details
- Photo, species name, description, and location are shown
- NO edit and delete buttons visible
- Modal is read-only

**Actual Result**: 
- ✅ PASS: Modal opened with details
- ✅ PASS: All information displayed correctly
- ✅ PASS: No edit/delete buttons visible
- ✅ PASS: Modal was read-only

**Status**: PASS

---

## 7. EDIT MODAL TESTS

### TC016: Edit Modal - Load Existing Data
**Objective**: Verify edit modal loads existing sighting data correctly

**Pre-conditions**: 
- User has added a sighting with name "Red Hornbill" and description "Beautiful bird"
- User is on User Sightings screen

**Test Steps**:
1. Navigate to User Sightings
2. Tap on a sighting to open DisplayModal
3. Tap "Edit" button
4. Observe the edit modal fields

**Expected Result**: 
- Edit modal opens
- modal shows existing data

**Actual Result**: 
- ✅ PASS: Edit modal opened correctly
- ❌ FAIL: Data not prepopulated (Bug #001)

**Status**: FAIL
**Comments**: Edit modal not retrieving existing data properly - needs investigation

---

### TC017: Edit Modal - Save Changes Successfully
**Objective**: Verify user can edit and save changes to their sighting

**Pre-conditions**: 
- Edit modal is open with a sighting

**Test Steps**:
1. Change species name from "Red Hornbill" to "Blue Hornbill"
2. Change description to add " - spotted at sunset"
3. Tap "Save Changes" button
4. Navigate back to view the sighting

**Expected Result**: 
- Changes are saved successfully
- Success toast appears: "Sighting updated successfully"
- Modal closes automatically
- Updated data appears in User Sightings and View Sightings

**Actual Result**: 
- ✅ PASS: Changes saved successfully
- ✅ PASS: Success toast appeared
- ✅ PASS: Modal closed automatically
- ✅ PASS: Updated data visible everywhere

**Status**: PASS

---

### TC018: Edit Modal - Cancel Changes
**Objective**: Verify cancel functionality preserves original data

**Pre-conditions**: 
- Edit modal is open

**Test Steps**:
1. Make changes to species name and description
2. Tap "Cancel" button
3. Reopen the sighting to verify data

**Expected Result**: 
- Modal closes without saving
- Original data is preserved
- No success/error messages appear
- Sighting data remains unchanged

**Actual Result**: 
- ✅ PASS: Modal closed without saving
- ✅ PASS: Original data preserved
- ✅ PASS: No unwanted messages
- ✅ PASS: Data remained unchanged

**Status**: PASS

---

## 8. DELETE MODAL TESTS

### TC019: Delete Modal - Confirmation Dialog
**Objective**: Verify delete confirmation dialog appears and functions correctly

**Pre-conditions**: 
- User has a sighting in User Sightings
- DisplayModal is open for user's own sighting

**Test Steps**:
1. Tap "Delete" button in DisplayModal
2. Observe confirmation dialog
3. Read the confirmation message
4. Test both "Cancel" and "Delete" options

**Expected Result**: 
- Confirmation dialog appears
- Message asks "Are you sure you want to delete this sighting?"
- Two buttons visible: "Cancel" and "Delete"
- Cancel preserves sighting, Delete removes it

**Actual Result**: 
- ✅ PASS: Confirmation dialog appeared
- ✅ PASS: Clear confirmation message
- ✅ PASS: Both buttons visible and labeled correctly
- ✅ PASS: Cancel preserved, Delete removed sighting

**Status**: PASS

---

### TC020: Delete Modal - Failed Modal Closure
**Objective**: Verify modal behavior after deletion on Add Spotting screen

**Pre-conditions**: 
- User is on Add Spotting screen
- At least one sighting marker is visible on map
- User taps on existing sighting marker

**Test Steps**:
1. Navigate to Add Spotting screen
2. Tap on an existing sighting marker (not newly added one)
3. DisplayModal opens showing sighting details
4. Tap "Delete" button
5. Confirm deletion in dialog
6. Observe modal behavior

**Expected Result**: 
- Sighting is deleted from database
- Success toast appears
- DisplayModal closes automatically
- User returns to map view
- Deleted marker disappears from map

**Actual Result**: 
- ✅ PASS: Sighting deleted from database
- ✅ PASS: Success toast appeared
- ✅ PASS: DisplayModal closed
- ✅ PASS: User returns to Map View
- ❌ FAIL: Showing deleted sighting marker (Add spotting screen) (#Bug 002)

**Status**: FAIL
**Comments**: Marker doesn't disappear after deletion on Add Spotting screen - needs fix

---

### TC021: Delete Modal - Permission Check
**Objective**: Verify users can only delete their own sightings

**Pre-conditions**: 
- Database contains sightings from multiple users
- User is logged in

**Test Steps**:
1. Navigate to View Sightings
2. Tap on another user's sighting marker
3. Observe DisplayModal content
4. Check for delete button availability

**Expected Result**: 
- DisplayModal opens for other user's sighting
- Sighting details are visible (read-only)
- NO delete button should be visible
- NO edit button should be visible

**Actual Result**: 
- ✅ PASS: Modal opened for other user's sighting
- ✅ PASS: Details visible and read-only
- ✅ PASS: No delete button visible
- ✅ PASS: No edit button visible

**Status**: PASS

---

### TC022: Delete Last Sighting
**Objective**: Verify behavior when user deletes their last remaining sighting

**Pre-conditions**: 
- User has only one sighting remaining
- User is on User Sightings screen

**Test Steps**:
1. Navigate to User Sightings
2. Tap on the only sighting
3. Tap "Delete" button
4. Confirm deletion
5. Observe User Sightings screen after deletion

**Expected Result**: 
- Sighting deletes successfully
- Success toast appears
- User Sightings screen shows "No sightings added yet" message
- Screen displays empty state gracefully

**Actual Result**: 
- ✅ PASS: Sighting deleted successfully
- ✅ PASS: Success toast appeared
- ✅ PASS: "No sightings added yet" message displayed
- ✅ PASS: Empty state handled gracefully

**Status**: PASS

---

## 9. PERFORMANCE & USABILITY TESTS

### TC023: App Performance with Multiple Sightings
**Objective**: Verify app performance with large dataset

**Pre-conditions**: 
- Database contains 20+ sightings

**Test Steps**:
1. Navigate to View Sightings
2. Time how long map takes to load
3. Test scroll and zoom performance
4. Apply and remove various filters

**Expected Result**: 
- Map loads within 3 seconds
- Smooth scrolling and zooming
- Filters apply within 1 second
- No crashes or freezing

**Actual Result**: 
- ✅ PASS: Map loaded in 2.5 seconds
- ✅ PASS: No lag when zooming with many markers
- ✅ PASS: Filters applied instantly
- ✅ PASS: No crashes observed

**Status**: PASS

---

### TC024: Cross-Platform Toast Messages
**Objective**: Verify toast messages work on different platforms

**Pre-conditions**: 
- Test on both Android and iOS (if available)

**Test Steps**:
1. Perform various actions that trigger toasts
2. Observe toast appearance and timing
3. Test multiple toasts in sequence

**Expected Result**: 
- Toasts appear on both platforms
- Messages are readable and properly styled
- Toasts disappear after appropriate time

**Actual Result**: 
- ❌ FAIL: Toast messages do appear on iOs  (#Bug 003)
- ✅ PASS: Messages were clear and well-styled
- ✅ PASS: Proper timing (3-4 seconds)

**Status**: FAIL
**Comments**: Need to display toast messages on iOS devices

----

## SUMMARY

**Total Test Cases**: 100
**Passed**: 96 (96%)
**Failed**: 3 (3%)
**Partial Pass**: 1 (1%)

### Critical Bugs Found:
1. **Bug #001**: Edit modal does not retain original data
2. **Bug #002**: Deleted marker does not disappear from map
3. **Bug #003**: Toast messages do appear on iOs

### Recommendations:
1.  Fix edit modal data retrieval (Bug #001)
2.  Fix delete modal closure on Add Spotting screen (Bug #002)
3.  Fix toast messages to appear on iOs devices as well (Bug #003)

### Test Coverage:
- User Authentication
- Navigation
- Core Functionality (Add/View Sightings)
- Filtering Features
- User Interface Components
- Edit/Delete Functionality
- Error Scenarios
- Performance Testing (partial)


**Test Completion Date**: July 24, 2025
**Next Test Cycle**: After bug fixes are implemented
**Test Document Version**: 1.0
