//  Vaccination schedule (based on Kenya Ministry of Health guidelines)
        const VACCINE_SCHEDULE = [
            { name: 'BCG', age: 0, ageText: 'At Birth', description: 'Protection against tuberculosis', disease: 'Tuberculosis' },
            { name: 'OPV 0', age: 0, ageText: 'At Birth', description: 'Oral Polio Vaccine - Birth dose', disease: 'Poliomyelitis' },
            { name: 'OPV 1', age: 6, ageText: '6 Weeks', description: 'Oral Polio Vaccine - 1st dose', disease: 'Poliomyelitis' },
            { name: 'DPT-HepB-Hib 1', age: 6, ageText: '6 Weeks', description: 'Pentavalent vaccine - 1st dose', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b' },
            { name: 'PCV 1', age: 6, ageText: '6 Weeks', description: 'Pneumococcal vaccine - 1st dose', disease: 'Pneumonia & Meningitis' },
            { name: 'Rota 1', age: 6, ageText: '6 Weeks', description: 'Rotavirus vaccine - 1st dose', disease: 'Severe diarrhea' },
            { name: 'OPV 2', age: 10, ageText: '10 Weeks', description: 'Oral Polio Vaccine - 2nd dose', disease: 'Poliomyelitis' },
            { name: 'DPT-HepB-Hib 2', age: 10, ageText: '10 Weeks', description: 'Pentavalent vaccine - 2nd dose', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b' },
            { name: 'PCV 2', age: 10, ageText: '10 Weeks', description: 'Pneumococcal vaccine - 2nd dose', disease: 'Pneumonia & Meningitis' },
            { name: 'Rota 2', age: 10, ageText: '10 Weeks', description: 'Rotavirus vaccine - 2nd dose', disease: 'Severe diarrhea' },
            { name: 'OPV 3', age: 14, ageText: '14 Weeks', description: 'Oral Polio Vaccine - 3rd dose', disease: 'Poliomyelitis' },
            { name: 'DPT-HepB-Hib 3', age: 14, ageText: '14 Weeks', description: 'Pentavalent vaccine - 3rd dose', disease: 'Diphtheria, Pertussis, Tetanus, Hepatitis B, Haemophilus influenzae type b' },
            { name: 'PCV 3', age: 14, ageText: '14 Weeks', description: 'Pneumococcal vaccine - 3rd dose', disease: 'Pneumonia & Meningitis' },
            { name: 'IPV', age: 14, ageText: '14 Weeks', description: 'Inactivated Polio Vaccine', disease: 'Poliomyelitis' },
            { name: 'Vitamin A', age: 26, ageText: '6 Months', description: 'Vitamin A supplementation', disease: 'Vitamin A deficiency' },
            { name: 'Measles-Rubella 1', age: 39, ageText: '9 Months', description: 'Measles-Rubella vaccine - 1st dose', disease: 'Measles & Rubella' },
            { name: 'Yellow Fever', age: 39, ageText: '9 Months', description: 'Yellow Fever vaccine', disease: 'Yellow Fever' },
            { name: 'Vitamin A', age: 52, ageText: '12 Months', description: 'Vitamin A supplementation - 2nd dose', disease: 'Vitamin A deficiency' },
            { name: 'Measles-Rubella 2', age: 78, ageText: '18 Months', description: 'Measles-Rubella vaccine - 2nd dose', disease: 'Measles & Rubella' },
            { name: 'Vitamin A', age: 78, ageText: '18 Months', description: 'Vitamin A supplementation - 3rd dose', disease: 'Vitamin A deficiency' }
        ];

        let currentChildId = null;
        let currentVaccineIndex = null;

        // Set max date to today
        document.getElementById('childDOB').max = new Date().toISOString().split('T')[0];
        document.getElementById('vaccinationDate').max = new Date().toISOString().split('T')[0];

        function initializeData() {
            const existingData = localStorage.getItem('children');
            if (!existingData) {
                localStorage.setItem('children', JSON.stringify([]));
            }
            loadChildren();
        }

        function getChildren() {
            const data = localStorage.getItem('children');
            return data ? JSON.parse(data) : [];
        }

        function saveChildren(children) {
            localStorage.setItem('children', JSON.stringify(children));
        }

        function calculateAge(dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            const ageInWeeks = Math.floor((today - birthDate) / (7 * 24 * 60 * 60 * 1000));
            
            if (ageInWeeks < 4) return `${ageInWeeks} weeks`;
            if (ageInWeeks < 52) return `${Math.floor(ageInWeeks / 4)} months`;
            const years = Math.floor(ageInWeeks / 52);
            const months = Math.floor((ageInWeeks % 52) / 4);
            return `${years} year${years > 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
        }

        function loadChildren() {
            const children = getChildren();
            const container = document.getElementById('childButtons');
            
            container.innerHTML = '<button class="child-btn add-child-btn" onclick="openAddChildModal()">+ Add Child</button>';
            
            children.forEach(child => {
                const btn = document.createElement('button');
                btn.className = 'child-btn';
                btn.textContent = child.name;
                btn.onclick = () => selectChild(child.id);
                if (currentChildId === child.id) {
                    btn.classList.add('active');
                }
                container.appendChild(btn);
            });

            if (children.length > 0 && !currentChildId) {
                selectChild(children[0].id);
            }
        }

        function selectChild(childId) {
            currentChildId = childId;
            loadChildren();
            displayChildInfo();
            displayVaccineTimeline();
            displayStats();
        }

        function displayChildInfo() {
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            if (!child) return;

            const container = document.getElementById('childInfo');
            container.style.display = 'block';

            const completedVaccines = child.vaccinations ? child.vaccinations.filter(v => v.completed).length : 0;
            const totalVaccines = VACCINE_SCHEDULE.length;
            const progress = Math.round((completedVaccines / totalVaccines) * 100);

            container.innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name</span>
                        <span class="info-value">${child.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Age</span>
                        <span class="info-value">${calculateAge(child.dob)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Gender</span>
                        <span class="info-value">${child.gender}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Vaccinations</span>
                        <span class="info-value">${completedVaccines}/${totalVaccines}</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%">${progress}%</div>
                </div>
                <div class="form-group-new">
                    <button class="btn-primary" onclick="editChild()">Edit Info</button>
                    <button class="btn-danger" onclick="deleteChild()">Delete Child</button>
                </div>
            `;
        }

        function displayStats() {
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            if (!child) return;

            const today = new Date();
            const birthDate = new Date(child.dob);
            const ageInWeeks = Math.floor((today - birthDate) / (7 * 24 * 60 * 60 * 1000));

            let completed = 0;
            let overdue = 0;
            let upcoming = 0;
            let dueSoon = 0;

            VACCINE_SCHEDULE.forEach((vaccine, index) => {
                const vaccinationRecord = child.vaccinations?.find(v => v.vaccineIndex === index);
                
                if (vaccinationRecord?.completed) {
                    completed++;
                } else if (ageInWeeks >= vaccine.age + 4) {
                    overdue++;
                } else if (ageInWeeks >= vaccine.age) {
                    dueSoon++;
                } else {
                    upcoming++;
                }
            });

            const container = document.getElementById('statsGrid');
            container.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number" style="color: #48bb78;">${completed}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #ed8936;">${dueSoon}</div>
                    <div class="stat-label">Due Soon</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #f56565;">${overdue}</div>
                    <div class="stat-label">Overdue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #4299e1;">${upcoming}</div>
                    <div class="stat-label">Upcoming</div>
                </div>
            `;
        }

        function displayVaccineTimeline() {
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            if (!child) return;

            const today = new Date();
            const birthDate = new Date(child.dob);
            const ageInWeeks = Math.floor((today - birthDate) / (7 * 24 * 60 * 60 * 1000));

            const container = document.getElementById('vaccineTimeline');
            
            if (ageInWeeks < 0) {
                container.innerHTML = '<div class="alert alert-info">Child\'s date of birth is in the future. Please check the date.</div>';
                return;
            }

            let html = '';
            const overdueCount = VACCINE_SCHEDULE.filter((v, i) => {
                const record = child.vaccinations?.find(r => r.vaccineIndex === i);
                return !record?.completed && ageInWeeks >= v.age + 4;
            }).length;

            if (overdueCount > 0) {
                html += `<div class="alert alert-warning">⚠️ You have ${overdueCount} overdue vaccination${overdueCount > 1 ? 's' : ''}. Please visit a health facility soon!</div>`;
            }

            VACCINE_SCHEDULE.forEach((vaccine, index) => {
                const vaccinationRecord = child.vaccinations?.find(v => v.vaccineIndex === index);
                let status = 'upcoming';
                let statusClass = 'status-upcoming';
                let cardClass = '';

                if (vaccinationRecord?.completed) {
                    status = 'Completed';
                    statusClass = 'status-completed';
                    cardClass = 'completed';
                } else if (ageInWeeks >= vaccine.age + 4) {
                    status = 'Overdue';
                    statusClass = 'status-overdue';
                    cardClass = 'overdue';
                } else if (ageInWeeks >= vaccine.age) {
                    status = 'Due Now';
                    statusClass = 'status-due';
                    cardClass = 'due-soon';
                } else {
                    const weeksUntil = vaccine.age - ageInWeeks;
                    status = `In ${weeksUntil} week${weeksUntil !== 1 ? 's' : ''}`;
                }

                html += `
                    <div class="vaccine-card ${cardClass}">
                        <div class="vaccine-header">
                            <div>
                                <div class="vaccine-name">${vaccine.name}</div>
                                <div class="vaccine-age">Recommended: ${vaccine.ageText}</div>
                            </div>
                            <span class="vaccine-status ${statusClass}">${status}</span>
                        </div>
                        <div class="vaccine-details">
                            <strong>Protection:</strong> ${vaccine.disease}<br>
                            <strong>Description:</strong> ${vaccine.description}
                `;

                if (vaccinationRecord?.completed) {
                    html += `<br><strong>Given on:</strong> ${new Date(vaccinationRecord.date).toLocaleDateString()}`;
                    if (vaccinationRecord.facility) {
                        html += `<br><strong>Facility:</strong> ${vaccinationRecord.facility}`;
                    }
                }

                html += `</div><div class="vaccine-actions">`;

                if (!vaccinationRecord?.completed) {
                    html += `<button class="btn-success" onclick="openVaccineModal(${index})">Mark as Given</button>`;
                } else {
                    html += `<button class="btn-secondary" onclick="undoVaccination(${index})">Undo</button>`;
                }

                html += `</div></div>`;
            });

            container.innerHTML = html;
        }

        function openAddChildModal() {
            document.getElementById('addChildModal').classList.add('active');
            document.getElementById('childForm').reset();
        }

        function closeAddChildModal() {
            document.getElementById('addChildModal').classList.remove('active');
        }

        function addChild(event) {
            event.preventDefault();
            
            const children = getChildren();
            const newChild = {
                id: Date.now(),
                name: document.getElementById('childName').value,
                dob: document.getElementById('childDOB').value,
                gender: document.getElementById('childGender').value,
                vaccinations: []
            };

            children.push(newChild);
            saveChildren(children);
            closeAddChildModal();
            selectChild(newChild.id);
        }

        function deleteChild() {
            if (!confirm('Are you sure you want to delete this child\'s record? This cannot be undone.')) return;
            
            const children = getChildren();
            const filtered = children.filter(c => c.id !== currentChildId);
            saveChildren(filtered);
            currentChildId = null;
            loadChildren();
            document.getElementById('childInfo').style.display = 'none';
            document.getElementById('vaccineTimeline').innerHTML = '';
            document.getElementById('statsGrid').innerHTML = '';
        }

        function openVaccineModal(vaccineIndex) {
            currentVaccineIndex = vaccineIndex;
            document.getElementById('vaccineModal').classList.add('active');
            document.getElementById('vaccineForm').reset();
            document.getElementById('vaccinationDate').value = new Date().toISOString().split('T')[0];
        }

        function closeVaccineModal() {
            document.getElementById('vaccineModal').classList.remove('active');
            currentVaccineIndex = null;
        }

        function markVaccineGiven(event) {
            event.preventDefault();
            
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            
            if (!child.vaccinations) {
                child.vaccinations = [];
            }

            const vaccination = {
                vaccineIndex: currentVaccineIndex,
                completed: true,
                date: document.getElementById('vaccinationDate').value,
                facility: document.getElementById('healthFacility').value,
                batchNumber: document.getElementById('batchNumber').value,
                notes: document.getElementById('notes').value
            };

            const existingIndex = child.vaccinations.findIndex(v => v.vaccineIndex === currentVaccineIndex);
            if (existingIndex >= 0) {
                child.vaccinations[existingIndex] = vaccination;
            } else {
                child.vaccinations.push(vaccination);
            }

            saveChildren(children);
            closeVaccineModal();
            displayChildInfo();
            displayVaccineTimeline();
            displayStats();
        }

        function undoVaccination(vaccineIndex) {
            if (!confirm('Are you sure you want to undo this vaccination record?')) return;
            
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            
            child.vaccinations = child.vaccinations.filter(v => v.vaccineIndex !== vaccineIndex);
            
            saveChildren(children);
            displayChildInfo();
            displayVaccineTimeline();
            displayStats();
        }

        function editChild() {
            const children = getChildren();
            const child = children.find(c => c.id === currentChildId);
            if (child) {
                document.getElementById('childName').value = child.name;
                document.getElementById('childDOB').value = child.dob;
                document.getElementById('childGender').value = child.gender;
                deleteChild();
                openAddChildModal();
            }
        }

        // Close modals when clicking outside
        document.getElementById('addChildModal').addEventListener('click', function(e) {
            if (e.target === this) closeAddChildModal();
        });

        document.getElementById('vaccineModal').addEventListener('click', function(e) {
            if (e.target === this) closeVaccineModal();
        });

        // Initialize
        initializeData();