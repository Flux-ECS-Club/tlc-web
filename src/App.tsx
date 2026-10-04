/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveArchitecture } from './components/InteractiveArchitecture';
import { CouncilSection } from './components/CouncilSection';
import { EventsSection } from './components/EventsSection';
import { InventorySection } from './components/InventorySection';
import { NewsletterAndContactSection } from './components/NewsletterAndContactSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

// Modals
import { ComponentRequestModal } from './components/modals/ComponentRequestModal';
import { AddComponentModal } from './components/modals/AddComponentModal';
import { IssueReturnModal } from './components/modals/IssueReturnModal';
import { EventRegistrationModal } from './components/modals/EventRegistrationModal';
import { CouncilMemberModal } from './components/modals/CouncilMemberModal';
import { JoinPortalModal } from './components/modals/JoinPortalModal';
import { RequestHistoryModal } from './components/modals/RequestHistoryModal';
import { PinMapModal } from './components/modals/PinMapModal';
import { SchematicsModal } from './components/modals/SchematicsModal';
import { DemoScenarioModal } from './components/modals/DemoScenarioModal';

import { InventoryItem, EventItem, CouncilMember } from './types';

function MainApp() {
  const { inventory, council, events } = useApp();

  // Modal States
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);

  const [issueReturnOpen, setIssueReturnOpen] = useState(false);
  const [issueReturnItem, setIssueReturnItem] = useState<InventoryItem | null>(null);
  const [issueReturnMode, setIssueReturnMode] = useState<'ISSUE' | 'RETURN'>('ISSUE');
  const [associatedRequestId, setAssociatedRequestId] = useState<string | undefined>(undefined);

  const [eventRegOpen, setEventRegOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CouncilMember | null>(null);

  const [portalOpen, setPortalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [pinMapOpen, setPinMapOpen] = useState(false);
  const [schematicsOpen, setSchematicsOpen] = useState(false);
  const [demoScenarioOpen, setDemoScenarioOpen] = useState(false);

  // Handlers
  const handleOpenRequest = (item?: InventoryItem) => {
    setSelectedInventoryItem(item || inventory[0] || null);
    setRequestModalOpen(true);
  };

  const handleOpenIssueReturn = (item?: InventoryItem, mode: 'ISSUE' | 'RETURN' = 'ISSUE') => {
    setIssueReturnItem(item || inventory[0] || null);
    setIssueReturnMode(mode);
    setAssociatedRequestId(undefined);
    setIssueReturnOpen(true);
  };

  const handleOpenIssueFromHistory = (componentId: string, requestId?: string) => {
    const item = inventory.find((i) => i.id === componentId) || null;
    setIssueReturnItem(item);
    setIssueReturnMode('ISSUE');
    setAssociatedRequestId(requestId);
    setIssueReturnOpen(true);
  };

  const handleOpenReturnFromHistory = (componentId: string, requestId?: string) => {
    const item = inventory.find((i) => i.id === componentId) || null;
    setIssueReturnItem(item);
    setIssueReturnMode('RETURN');
    setAssociatedRequestId(requestId);
    setIssueReturnOpen(true);
  };

  const handleRegisterTeam = (event: EventItem) => {
    setSelectedEvent(event);
    setEventRegOpen(true);
  };

  const handleSelectMember = (member: CouncilMember) => {
    setSelectedMember(member);
    setMemberModalOpen(true);
  };

  const handleSelectEcosystemComponent = (componentId: string) => {
    const item = inventory.find((i) => i.id === componentId);
    if (item) {
      handleOpenRequest(item);
    }
  };

  return (
    <div className="bg-[#0d0e15] text-[#e3e1ec] min-h-screen flex flex-col selection:bg-[#ff5545] selection:text-white relative overflow-x-hidden">
      {/* Ambient Cyber Gradients & Glow Accents (Exact from Screenshot) */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-[#ff3b30]/15 via-[#00eefc]/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[45%] -left-32 w-[400px] h-[400px] bg-[#00eefc]/8 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 -right-32 w-[500px] h-[500px] bg-[#ff3b30]/10 blur-[140px] pointer-events-none -z-10" />

      {/* Top Navigation */}
      <Navbar
        onOpenPortal={() => setPortalOpen(true)}
        onOpenComponentRequest={() => handleOpenRequest()}
        onOpenAddComponent={() => setAddModalOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenDemoScenario={() => setDemoScenarioOpen(true)}
      />

      {/* Main Body */}
      <main className="w-full pt-28 flex-1 flex flex-col gap-20">
        <Hero onRequestComponents={() => handleOpenRequest()} />

        <InteractiveArchitecture
          onInspectPinMap={() => setPinMapOpen(true)}
          onOpenSchematics={() => setSchematicsOpen(true)}
          onSelectComponent={handleSelectEcosystemComponent}
        />

        <CouncilSection
          onSelectMember={handleSelectMember}
          onViewAllMembers={() => {
            if (council.length > 0) {
              handleSelectMember(council[0]);
            }
          }}
        />

        <EventsSection
          onRegisterTeam={handleRegisterTeam}
          onOpenArchive={(ev) => handleRegisterTeam(ev)}
        />

        <InventorySection
          onRequestModal={handleOpenRequest}
          onAddModal={() => setAddModalOpen(true)}
          onIssueReturnModal={handleOpenIssueReturn}
          onOpenHistory={() => setHistoryOpen(true)}
        />

        <NewsletterAndContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPortal={() => setPortalOpen(true)}
        onOpenComponentRequest={() => handleOpenRequest()}
        onOpenAddComponent={() => setAddModalOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      {/* Floating Toast Notification HUD */}
      <ToastContainer />

      {/* Interactive Modals */}
      <ComponentRequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        preselectedItem={selectedInventoryItem}
      />

      <AddComponentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <IssueReturnModal
        isOpen={issueReturnOpen}
        onClose={() => setIssueReturnOpen(false)}
        preselectedItem={issueReturnItem}
        defaultMode={issueReturnMode}
        associatedRequestId={associatedRequestId}
      />

      <EventRegistrationModal
        isOpen={eventRegOpen}
        onClose={() => setEventRegOpen(false)}
        event={selectedEvent}
      />

      <CouncilMemberModal
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        member={selectedMember}
      />

      <JoinPortalModal
        isOpen={portalOpen}
        onClose={() => setPortalOpen(false)}
      />

      <RequestHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpenIssueModal={handleOpenIssueFromHistory}
        onOpenReturnModal={handleOpenReturnFromHistory}
      />

      <PinMapModal
        isOpen={pinMapOpen}
        onClose={() => setPinMapOpen(false)}
      />

      <SchematicsModal
        isOpen={schematicsOpen}
        onClose={() => setSchematicsOpen(false)}
      />

      <DemoScenarioModal
        isOpen={demoScenarioOpen}
        onClose={() => setDemoScenarioOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
